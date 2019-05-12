var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.TableActive = "active";
    $scope.ActiveDH = "active";
    $scope.TableOpen = "menu-open";

    $scope.TrangThaiChoXuLy = "Chờ xử lý";//0  
    $scope.TrangThaiDaXuLy = "Đã xác nhận";//1
    $scope.TrangThaiDangGiaoHang = "Đang giao hàng";//2
    $scope.TrangThaiDaNhanHang = "Đã nhận hàng";//3
    $scope.TrangThaiKhachHuyHang = "Đã hủy";//4

    $scope.TrangThaiDaHoantien = "Đã hoàn tiền";//2
    $scope.TrangThaiDaThanhToan = "Đã thanh toán";//1
    $scope.TrangThaiChuaThanhToan = "Chưa thanh toán";//0

    $scope.ThanhToanThe = "Thanh toán qua thẻ";//1
    $scope.ThanhTaiNha = "Thanh toán tại nhà";//0

    $scope.MessengerDH = "Không tìm thấy đơn hàng nào...";

    $scope.ConvertData = [];
    $scope.ConvertListData = [];

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    $scope.NgayDat = dd + '/' + mm + '/' + yyyy;

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
            for (var i = 0; i < $scope.ListDonHang.length; i++) {
                if ($scope.ListDonHang[i].PhuongThuc == 0) {
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
                $scope.ListDonHang[i].Date = $scope.ListDonHang[i].NgayDat + '/' + $scope.ListDonHang[i].ThangDat + '/' + $scope.ListDonHang[i].NamDat + ' ' + $scope.ListDonHang[i].GioDat;
            }
            $('#table-tbody').css('display', 'block');

        }, function myError(res) {
        });
    }

    $scope.Timkiem = function () {
        if ($scope.TrangThai == null || $scope.TrangThai == "") {
            $scope.TrangThai = "";
        }
        if ($scope.NgayDat == null || $scope.NgayDat == "") {
            $scope.NgayDat = null;
        }
        var data = {
            TrangThai: $scope.TrangThai,
            NgayDat: $scope.NgayDat
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
        //else {
        //    $scope.LoadDonHang();
        //}
    }

    $scope.btnDetele = function () {
        debugger
        $scope.ListCheck = [];
        var checkbox = document.getElementsByName('Check');
        for (var i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked === true) {
                $scope.ListCheck.push(checkbox[i].value);
            }
        }
        if ($scope.ListCheck.length == 0) {
            toastr.error("Bạn chưa tích chọn xóa ô nào", 'Error');
            return
        }
        else {
            swal({
                title: "Thông báo?",
                text: "Bạn có chắc chắn muốn xóa những đơn hàng này",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "OK",
                //closeOnConfirm: false
            },
                    function () {
                        var response = $http({
                            url: "/DonHang/Delete",
                            method: "POST",
                            data: JSON.stringify($scope.ListCheck),
                            dataType: "json"
                        });
                        response.then(function (res) {
                            if (res.data.messenger.IsSuccess == true) {
                                toastr.success(res.data.messenger.Message, 'Success');
                                $scope.LoadDonHang();

                            }
                            else {
                                if (res.data.messenger.RedirectToAction != null && res.data.messenger.RedirectToAction == true) {
                                    window.location.href = "/Page404/Index";
                                }
                                else {
                                    toastr.error(res.data.messenger.Message, 'Error');
                                    $scope.LoadDonHang();

                                }

                            }
                        }, function (res) {
                            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
                        });
                    });
        }
    }

    $scope.Convert = function (list) {

        $scope.isShowCapNhap = true;

        $scope.ConvertData.MaDB = list.MaDB;

        var ListName = list.KHACHHANG.TenKH.split(" ");
        ListName = ListName[2].slice(0, 1);
        $scope.AvatarName = ListName.toLocaleUpperCase();

        $scope.TenKH = list.KHACHHANG.TenKH;
        $scope.SDT = list.KHACHHANG.SDT;
        $scope.DiaChi = list.KHACHHANG.DiaChi + '-' + list.KHACHHANG.HUYEN.TenHuyen + '-' + list.KHACHHANG.THANHPHO.TenThanhPho;
        debugger
        $scope.ConvertData.TrangThai1 = list.TrangThai.toString();
        $scope.ConvertData.TrangThaiThanhToan = list.TrangThaiThanhToan.toString();


        if ($scope.ConvertData.TrangThaiThanhToan == 'true') {
            $('#DH2').prop('disabled', 'disabled');
        }
        else {
            $('#DH2').prop('disabled', false);
        }
        if ($scope.ConvertData.TrangThai1 == 4) {
            $scope.isShowCapNhap = false;
        }
        if ($scope.ConvertData.TrangThaiThanhToan == 'true' && $scope.ConvertData.TrangThai1 == 3 || $scope.ConvertData.TrangThai1 == 4) {
            $scope.isShowCapNhap = false;

        }
        if ($scope.ConvertData.TrangThai1 == 1) {
            //$("#TT0").prop('disabled', true);
            $('#TT0').prop('disabled', true);
            $('#DH1').select2();
        }
        else if ($scope.ConvertData.TrangThai1 == 2) {
            $('#TT0').prop('disabled', true);
            $('#TT1').prop('disabled', !$('#TT1').prop('disabled'));
            $('#DH1').select2();
        }
        else if ($scope.ConvertData.TrangThai1 == 3) {
            $('#DH1').prop('disabled', 'disabled');
            $('#DH1').select2();
        }
        else if ($scope.ConvertData.TrangThai1 == 4) {
            $('#DH1').prop('disabled', 'disabled');
            $('#DH2').prop('disabled', 'disabled');
            //$('#DH1').select2();
        }

        $scope.ListCTDH = list.CHITIETDONBAN;

        $scope.MaDB = list.MaDB;
        $scope.Date = list.Date;
        $scope.HinhThucThanhToan = list.PhuongThuc;
        $scope.TrangThaiThanhToan = list.TrangThaiThanhToan;
        $scope.TrangThai = list.TrangThai;
        $scope.PhiShip = list.PhiShip;
        $scope.TongTien = list.TongTien;

        ShowPopup($, "#SaveDonHang", 1200, 800)
        $('#cboxClose').css('display', 'none');
    }

    $scope.ClosePopup = function () {
        $.colorbox.close();
        //$('#SaveDonHang').css('display', 'none');
        $('#TT0').prop('disabled', false);
        $('#TT1').prop('disabled', false);
        $('#TT2').prop('disabled', false);
        $('#TT3').prop('disabled', false);
        $('#TT4').prop('disabled', false);
        $('#DH1').select2();

        $('#DH1').prop('disabled', false);
        $('#DH2').prop('disabled', false);
    }

    $scope.CapNhap = function () {
        debugger
        var data = {
            MaDB: $scope.ConvertData.MaDB,
            TrangThai: $scope.ConvertData.TrangThai1,
            TrangThaiThanhToan: $scope.ConvertData.TrangThaiThanhToan,
        }
        var response = $http({
            url: "/DonHang/ConvertDH",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            var $body = $('body');
            $body.showLoading();
            if (res.data.messenger.IsSuccess == true) {
                toastr.success(res.data.messenger.Message, 'Success');
                $scope.LoadDonHang();
                $scope.ClosePopup();
                $scope.ConvertData = [];
                $body.hideLoading();
            }
            else {
                if (res.data.messenger.RedirectToAction != null && res.data.messenger.RedirectToAction == true) {
                    window.location.href = "/Page404/Index";
                }
                else {
                    toastr.error(res.data.messenger.Message, 'Error');
                    $scope.LoadDonHang();
                    $scope.ClosePopup();
                    $body.hideLoading();
                    $scope.ConvertData = [];

                }

            }

        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    $scope.btnConvertList = function () {
        $scope.ListCheck = [];
        var checkbox = document.getElementsByName('Check');
        for (var i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked === true) {
                $scope.ListCheck.push(checkbox[i].value);
            }
        }
        if ($scope.ListCheck.length == 0) {
            toastr.error("Bạn chưa tích chọn xóa ô nào", 'Error');
            return
        }
        else {
            ShowPopup($, "#ConvertList", 700, 300);
            $('#cboxClose').css('display', 'none');
        }


    }

    $scope.CapNhapList = function () {
        if ($scope.ConvertListData.TrangThai == null || $scope.ConvertListData.TrangThai == "") {
            toastr.error("Bạn chưa chọn trạng thái đơn hàng", 'Error');
            return;
        }
        else if ($scope.ConvertListData.TrangThaiThanhToan == null || $scope.ConvertListData.TrangThaiThanhToan == "") {
            toastr.error("Bạn chưa chọn trạng thái thanh toán", 'Error');
            return;
        }
        else {
        debugger
            var $body = $('body');
            $body.showLoading();
            $scope.ListCheck = [];
            var checkbox = document.getElementsByName('Check');
            for (var i = 0; i < checkbox.length; i++) {
                if (checkbox[i].checked === true) {
                    $scope.ListCheck.push(checkbox[i].value);
                }
            }
            var data = {
                data: $scope.ListCheck,
                TrangThai: $scope.ConvertListData.TrangThai,
                TrangThaiThanhToan: $scope.ConvertListData.TrangThaiThanhToan,
            }
            var response = $http({
                url: "/DonHang/ConvertListDH",
                method: "POST",
                data: JSON.stringify(data),
                dataType: "json"
            });
            response.then(function (res) {

                if (res.data.messenger.IsSuccess == true) {
                    toastr.success(res.data.messenger.Message, 'Success');
                    $scope.LoadDonHang();
                    $scope.ClosePopup();
                    $body.hideLoading();
                    $scope.ConvertListData = [];
                }
                else {
                    if (res.data.messenger.RedirectToAction != null && res.data.messenger.RedirectToAction == true) {
                        window.location.href = "/Page404/Index";
                    }
                    else {
                        toastr.error(res.data.messenger.Message, 'Error');
                        $scope.LoadDonHang();
                        $scope.ClosePopup();
                        $body.hideLoading();
                        $scope.ConvertListData = [];


                    }

                }
            });
        }
       
    }

    $scope.btnXuatFile = function () {
    debugger
        if ($scope.TrangThai == null || $scope.TrangThai == "") {
            $scope.TrangThai = "";
        }
        if ($scope.NgayDat == null || $scope.NgayDat == "") {
            $scope.NgayDat = null;
        }
        window.location = "/DonHang/XuatFile?TrangThai=" + $scope.TrangThai + "&NgayDat=" + $scope.NgayDat;

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