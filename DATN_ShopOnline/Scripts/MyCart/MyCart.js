
var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Data = {};
    $scope.Login = true;
    //$scope.HomeShopActive = "active";

    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.LoginCheck();
        $scope.GetALLLoaiSP();
        $scope.GetListShopCart();
        setTimeout(function () {
            $('.sanpham').css('display', 'block');
        }, 500);
        $('.isShowheader').css('display', 'block');

    }

    //kiểm tra login
    $scope.LoginCheck = function () {
        $http({
            url: "/HomeShop/Login",
            method: 'GET'
        }).then(function mySuccess(res) {
            debugger
            if (res.data.messenger.IsSuccess == true) {
                $scope.Login = false;
                $scope.Logout = true;
                $scope.MyAccount = true;
                $scope.TenKH = res.data.result[0].TenKH;
            }

        }, function myError(res) {
        });
    }

    // Lấy tất cả loại sản phẩm
    $scope.GetALLLoaiSP = function () {
        $http({
            url: "/HomeShop/GetALLLoaiSP",
            method: 'GET'
        }).then(function mySuccess(res) {
            debugger
            $scope.ListLoaiSP = res.data.result;
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
                debugger
                $scope.TenNV = res.data.result[0].TenNV;
                $scope.HinhAnh = res.data.result[0].HinhAnh;
            }

        }, function myError(res) {
        });
    }

    //xem chi tiết của sản phẩm
    $scope.ModalDetail = function (content) {
        $scope.iSoLuong = 1;
        var ID = content;
        $http({
            url: "/HomeShop/GetDetail/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.GetDetail = res.data.result[0];
            $scope.iMaSP = $scope.GetDetail.MaSP;
            $scope.MaSP = $scope.GetDetail.MaSP;
            $scope.HinhAnh = $scope.GetDetail.HinhAnh;
            $scope.TenSP = $scope.GetDetail.TenSP;
            $scope.GiaBan = $scope.GetDetail.GiaBan;
            $scope.GioiThieu = $scope.GetDetail.MOTASANPHAM[0].GioiThieu1;
            $scope.TenNCC = $scope.GetDetail.NHACC.TenNCC;
            $scope.SoLuong = $scope.GetDetail.SoLuong;

        }, function myError(res) {
        });
    }

    //lấy danh sách giỏ hàng
    $scope.GetListShopCart = function () {
        $scope.CountCart = 0;
        $scope.TotalCart = 0;
        $scope.TotalQuanty = 0;
        $http({
            url: "/ShopCart/ShopCart",
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.ListShopCart = res.data.listShopCart;
            $scope.CoppyListShopCart = angular.copy($scope.ListShopCart);
            debugger
            if ($scope.ListShopCart == null) {
                $scope.isShowCartHollow = true;
                $scope.CartHollow = "Giỏ hàng không có sản phẩm nào.Mời bạn đặt hàng!!!";
                $scope.isShowButtonCart = false;

            }
            else if ($scope.ListShopCart.length == 0) {
                $scope.isShowCartHollow = true;
                $scope.CartHollow = "Giỏ hàng không có sản phẩm nào.Mời bạn đặt hàng!!!";
                $scope.isShowButtonCart = false;
            }
            else {
                $scope.isShowCartHollow = false;
                $scope.isShowButtonCart = true;
                $scope.CartHollow = "";
                $scope.CountCart = res.data.listShopCart.length;
                for (var i = 0; i < $scope.ListShopCart.length ; i++) {
                    $scope.TotalCart += $scope.ListShopCart[i].ThanhTien;
                    $scope.TotalQuanty += $scope.ListShopCart[i].iSoLuongBan;
                }
            }


        }, function myError(res) {
        });
    }

   
    //thay đổi số lượng trong json 
    $scope.ChangeSoLuong = function (iMaSP, iSoLuong) {
        debugger
        if (iSoLuong<=0) {
            toastr.error('Sản phẩm không thể nhỏ hơn 0', 'Error');
            return
        }
        else {
            var data = {
                iMaSP: iMaSP,
            }
            var response = $http({
                url: "/ShopCart/GetSP",
                method: "POST",
                data: JSON.stringify(data),
                dataType: "json"
            });
            response.then(function (res) {
                $scope.SanPham = res.data.result;
                console.log($scope.SanPham)
                if ($scope.SanPham[0].MaSP == iMaSP) {
                    if ($scope.SanPham[0].SoLuong < iSoLuong) {
                        toastr.error("Số lượng sản phẩm này chỉ còn " + $scope.SanPham[0].SoLuong + " " + "sản phẩm", 'Error');
                        for (var i = 0; i < $scope.ListShopCart.length; i++) {
                            if ($scope.ListShopCart[i].iMaSP == iMaSP) {
                                $scope.ListShopCart[i].iSoLuongBan = $scope.SanPham[0].SoLuong;
                                break;
                            }
                        }
                        return;
                    }

                }
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        }
        
    }

    //thêm sản phẩm vào giỏ
    $scope.AddCart = function (content) {
        var data = {
            iMaSP: content,
            iSoLuong: 1,
        }
        var response = $http({
            url: "/ShopCart/ADDShopCart",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            if (res.data.messenger.IsSuccess == true) {
                toastr.success(res.data.messenger.Message, 'Success');
                $scope.GetListShopCart();
            }
            else {
                toastr.error(res.data.messenger.Message, 'Error');
                $scope.GetListShopCart();
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //thêm sản phẩm vào giỏ
    $scope.AddCart1 = function () {
        debugger
        if (isNaN($scope.iSoLuong)) {
            toastr.error("Số lượng phải là số", 'Error');
            return
        }
        if ($scope.iSoLuong <= 0) {
            toastr.error("Số lượng phải lớn hơn 0", 'Error');
            return
        }
        var data = {
            iMaSP: $scope.iMaSP,
            iSoLuong: $scope.iSoLuong,
        }
        var response = $http({
            url: "/ShopCart/ADDShopCart",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            if (res.data.messenger.IsSuccess == true) {
                toastr.success(res.data.messenger.Message, 'Success');
                $scope.GetListShopCart();
            }
            else {
                toastr.error(res.data.messenger.Message, 'Error');
                $scope.GetListShopCart();
            }
        }, function (res) {
            toastr.error("lỗi rồi....", 'Error');
        });
    }

    //xóa sản phẩm trong giỏ
    $scope.DeteleCart = function (content) {
        var data = {
            iMaSP: content,
        }
        var response = $http({
            url: "/ShopCart/DeleteShopCart",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            if (res.data.messenger.IsSuccess == true) {
                toastr.success(res.data.messenger.Message, 'Success');
                $scope.GetListShopCart();
            }
            else {
                toastr.error(res.data.messenger.Message, 'Error');
                $scope.GetListShopCart();

            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //cập nhập toàn bộ giỏ hàng
    $scope.Update = function () {
        var data = [];
        var obj = {};
        for (var i = 0; i < $scope.ListShopCart.length; i++) {
            obj = { iMaSP: $scope.ListShopCart[i].iMaSP, iSoLuong: $scope.ListShopCart[i].iSoLuongBan };
            data.push(obj);
            var response = $http({
                url: "/ShopCart/Update",
                method: "POST",
                data: JSON.stringify(obj),
                dataType: "json"
            });        
        }
        response.then(function (res) {
            if (res.data.messenger.IsSuccess == true) {
                toastr.success(res.data.messenger.Message, 'Success');
                $scope.GetListShopCart();
            }
            else {
                toastr.error(res.data.messenger.Message, 'Error');
                $scope.GetListShopCart();

            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
       
    }

    //load lại trang
    $scope.refrech = function () {
        window.location.reload();
    }

    //điều hướng tới trang thanh toán
    $scope.Pay = function () {
        window.location.href = "/Pay/Index";
    }

    //điều hướng về trang chủ
    $scope.GoHome = function () {
        window.location.href = "/HomeShop/Index";
    }

});
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