var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.TableActive = "active";
    $scope.ActiveDH = "active";
    $scope.TableOpen = "menu-open";;
    
    $scope.TrangThaiChoXuLy = "Chờ xử lý";//0  
    $scope.TrangThaiDaXuLy = "Đã xử lý";//1
    $scope.TrangThaiDangGiaoHang = "Đang giao hàng";//2
    $scope.TrangThaiDaNhanHang = "Đã nhận hàng";//3
    $scope.TrangThaiKhachHuyHang = "Đã hủy";//4

    $scope.TrangThaiDaThanhToan = "Đã thanh toán";//1
    $scope.TrangThaiChuaThanhToan = "Chưa thanh toán";//0

    $scope.ThanhToanThe = "Thanh toán qua thẻ";//1
    $scope.ThanhTaiNha = "Thanh toán tại nhà";//0

    //Khởi tạo các hàm khi bắt đầu chạy giao diện
    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.Login();
        $scope.Seigneur();
        $scope.LoadDonHang();

    }
    //Lấy quyền hiển thị giao diện từ bảng nhân viên
    $scope.Seigneur = function () {
        $http({
            url: "/HomeAdmin/XemQuyen",
            method: 'GET'
        }).then(function mySuccess(res) {
            if (res.data.result[0].MaChucVu == 1) {
                $scope.ShowLSP = true;
                $scope.ShowNCC = true;
                $scope.ShowSP = true;
                $scope.ShowDH = true;
            }
            if (res.data.result[0].MaChucVu == 2) {
                $scope.ShowSP = true;
            }
        }, function myError(res) {
        });
    }

    //lấy hình ảnh và tên nhân viên
    $scope.Login = function () {
        $http({
            url: "/HomeAdmin/Login/",
            method: 'GET'
        }).then(function mySuccess(res) {
            if (res.data.messenger.IsSuccess == false) {
                toastr.error(res.data.messenger.Message, 'Error');
                location.href = "/LoginAdmin/Index";
            }
            if (res.data.messenger.IsSuccess == true) {
                $scope.TenNV = res.data.result[0].TenNV;
                $scope.HinhAnh = res.data.result[0].HinhAnh;
            }

        }, function myError(res) {
        });
    }

    //load toàn bộ sản phẩm lên giao diện
    $scope.LoadDonHang = function () {
        $http({
            url: "/DonHang/LoadDonHang",
            method: 'POST'
        }).then(function mySuccess(res) {
            $scope.ListDonHang = res.data.result;
            console.log($scope.ListDonHang)
            for (var i = 0; i < $scope.ListDonHang.length; i++) {
                if ($scope.ListDonHang[i].PhuongThuc==0) {
                    $scope.ListDonHang[i].LoaiPhuongThuc = "Thanh toán tại nhà";
                }
                else {
                    $scope.ListDonHang[i].LoaiPhuongThuc = "Thanh toán qua thẻ";
                }
                if ($scope.ListDonHang[i].TrangThai == 0) {
                    $scope.ListDonHang[i].LoaiTrangThai = "Chờ xử lý";
                }
                if ($scope.ListDonHang[i].TrangThai == 1) {
                    $scope.ListDonHang[i].LoaiTrangThai = "Đã xử lý";
                }
                if ($scope.ListDonHang[i].TrangThai == 2) {
                    $scope.ListDonHang[i].LoaiTrangThai = "Đang giao hàng";
                }
                if ($scope.ListDonHang[i].TrangThai == 3) {
                    $scope.ListDonHang[i].LoaiTrangThai = "Đã nhận hàng";
                }
                else {
                    $scope.ListDonHang[i].LoaiTrangThai = "Đã hủy";
                }
                if ($scope.ListDonHang[i].TrangThaiThanhToan == 0) {
                    $scope.ListDonHang[i].LoaiThanhToan = "Chưa thanh toán";
                }
                else {
                    $scope.ListDonHang[i].LoaiThanhToan = "Đã thanh toán";
                }
            }
        }, function myError(res) {
        });
    }
    $scope.Timkiem = function () {
        if ($scope.TrangThai!="") {
            var data = {
                TrangThai: $scope.TrangThai,
            }
            var response = $http({
                url: "/DonHang/Timkiem",
                method: "POST",
                data: JSON.stringify(data),
                dataType: "json"
            });
            response.then(function (res) {
                $scope.ListDonHang = res.data.result;
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        }
        else {
            $scope.LoadDonHang();
        }
    }

    $scope.btnDelete = function (MaDH) {
        swal({
            title: "Bạn có chắc không?",
            text: "Bạn có chắc chắn muốn xóa đơn hàng này",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "OK",
            //closeOnConfirm: false
        },
        function () {
        debugger
            var data = {
                MaDH: MaDH,
            }
            var response = $http({
                url: "/DonHang/Delete",
                method: "POST",
                data: JSON.stringify(data),
                dataType: "json"
            });
            response.then(function (res) {
                if (res.data.messenger.IsSuccess == true) {
                    toastr.success(res.data.messenger.Message, 'Success');
                    $scope.LoadDonHang();

                }
                else {
                    toastr.error(res.data.messenger.Message, 'Error');
                    $scope.LoadDonHang();

                }
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        });
       
    }
   
});

//khởi tạo thư viện toastr
app.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        "closeButton": true,
        "debug": true,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    });
});