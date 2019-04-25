
var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Data = {};
    $scope.Login = true;
    //$scope.HomeShopActive = "active";
    $scope.Login = true;
    $scope.Data.MaKH = 0;
    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.GetALLLoaiSP();
        $scope.LoginCheck();
        $scope.GetListShopCart();
        $scope.PayDetail();
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
            if (res.data.messenger.IsSuccess == true) {
                $scope.CoppyKH = angular.copy(res.data.result[0]);
                $scope.Login = false;
                $scope.Logout = true;
                $scope.MyAccount = true;
                $scope.TenKH = res.data.result[0].TenKH;
                $scope.Login = false;

                $scope.Data.MaKH = res.data.result[0].MaKH;
               

            }
            else {
                $scope.LoadCity();
                $scope.LoadDistrictHY();

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
            $scope.ListLoaiSP = res.data.result;
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
                    $scope.Data.TongTien += $scope.ListShopCart[i].ThanhTien;
                    $scope.TotalQuanty += $scope.ListShopCart[i].iSoLuongBan;
                }

            }
        }, function myError(res) {
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

    //lấy thông tin đơn hàng
    $scope.PayDetail = function () {
        var ID = content;
        debugger
        $http({
            url: "/PayDetail/PayDetail/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            console.log(res)

            //chi tiết đơn hàng và sản phẩm
            $scope.ListCTDH = res.data.result[0].CHITIETDONBAN;

            //thông tin khách hàng
            $scope.TenKH = res.data.result[0].KHACHHANG.TenKH;
            $scope.SDT = 0 + "" + res.data.result[0].KHACHHANG.SDT;
            $scope.DiaChi = res.data.result[0].KHACHHANG.DiaChi + " - " + res.data.result[0].KHACHHANG.HUYEN.TenHuyen + " - " + res.data.result[0].KHACHHANG.THANHPHO.TenThanhPho;

            //thông tin đơn hàng
            $scope.MaDB = res.data.result[0].MaDB;
            $scope.NgayDat = res.data.result[0].NgayDat + "-" + res.data.result[0].ThangDat + "-" + res.data.result[0].NamDat + " " + res.data.result[0].GioDat;
            if (res.data.result[0].PhuongThuc==0) {
                $scope.PhuongThuc = "Thanh toán tiền mặt";
                $scope.Phiship = res.data.result[0].PhiShip;
            }
            else {
                $scope.PhuongThuc = "Thanh toán qua thẻ";
            }
            if (res.data.result[0].TrangThaiThanhToan==true) {
                $scope.TrangThaiThanhToan = "Đã thanh toán";
            }
            else {
                $scope.TrangThaiThanhToan = "Chưa thanh toán";
            }
            $scope.TrangThaiDonHang = "Chờ xử lý";
            $scope.TongTien = res.data.result[0].TongTien;
        }, function myError(res) {
        });
    }

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