
var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Data = {};
    $scope.Login = true;
    //$scope.HomeShopActive = "active";
    $scope.Login = true;   
    $scope.NoiThanh = "";
    $scope.NgoaiThanh = "";
    $scope.Data.MaKH = 0;
    $scope.Data.PhuongThuc = "0";
    $scope.CoppyKH=[];
    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.GetALLLoaiSP();
        $scope.GetListShopCart();
        //$scope.LoadCity();
        //$scope.LoadDistrictHY();
        $scope.LoginCheck();
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

                var ListName = res.data.result[0].TenKH.split(" ");
                if (ListName.length>2) {
                    $scope.Data.Ten = ListName[2];
                    $scope.Data.TenDem = ListName[0] + " " + ListName[1];
                }
                else {
                    $scope.Data.Ten = ListName[1];
                    $scope.Data.TenDem = ListName[0];
                }
                debugger
                if (res.data.result[0].DiaChi!=null) {
                    $scope.Data.DiaChi = res.data.result[0].DiaChi;
                }
                if (res.data.result[0].SDT!=null) {
                    $scope.Data.SDT = res.data.result[0].SDT;
                    $scope.Data.SDT = 0 + "" + res.data.result[0].SDT;

                }
                if (res.data.result[0].Gmail!=null) {
                    $scope.Data.Gmail = res.data.result[0].Gmail;
                }
                $scope.Data.MaKH = res.data.result[0].MaKH;
                $scope.LoadCity();
                if (res.data.result[0].MaThanhPho != null) {
                    $scope.MaHuyen = res.data.result[0].MaHuyen;
                    $scope.Data.MaThanhPho = res.data.result[0].MaThanhPho;

                    var data = {
                        MaHuyen: $scope.Data.MaThanhPho,
                    };
                    var response = $http({
                        url: "/Pay/LoadDistrict",
                        method: "POST",
                        data: JSON.stringify(data),
                        dataType: "json"
                    });
                    response.then(function (res) {
                        debugger
                        $scope.ListDistrict = res.data.result;
                        if ($scope.MaHuyen != null) {
                            $scope.Data.MaHuyen = $scope.MaHuyen;
                        }
                    }, function (res) {
                        AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
                    });
                }
               
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
    
    //Đăng kí tài khoản
    $scope.Login = function () {
        var data = {
            TaiKhoan1: $scope.TaiKhoan1,
            MatKhau: $scope.MatKhau,
            URL: window.location.href
        };
        var response = $http({
            url: "/LoginShop/LoginPay",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            debugger
            if (res.data.messenger.IsSuccess == true) {
                window.location.href = res.data.messenger.Message;
            }
            else {
                toastr.error(res.data.messenger.Message, 'Error');
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Load tỉnh thành và mặc định chọn hưng yên
    $scope.LoadCity = function () {
        $http({
            url: "/Pay/LoadCity",
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.ListCity = res.data.result;
            debugger
            if ($scope.CoppyKH.length == 0) {
                $scope.Data.MaThanhPho = 1;
            }
            $scope.NoiThanh = "15.000 ₫";
            $scope.NgoaiThanh = "35.000 ₫";
        }, function myError(res) {
        });
    }

    //mặc định load huyện của hưng yên và mặc định chọn văn lâm
    $scope.LoadDistrictHY = function () {
        $http({
            url: "/Pay/LoadDistrictHY",
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.ListDistrict = res.data.result;
            if ($scope.CoppyKH.length == 0) {
                $scope.Data.MaHuyen = 2;
            }

        }, function myError(res) {
        });
    }

    //Load huyện khi chọn tỉnh
    $scope.ChangeCity = function () {
        //debugger
        //if ($scope.Data.TinhorThanh == null || $scope.Data.TinhorThanh == "") {
        //    $scope.Data.HuyenorQuan = "";
        //    $scope.ListDistrict = [];
        //    return;
        //}
        if ($scope.Data.MaThanhPho != null || $scope.Data.MaThanhPho != "") {
            $scope.ErrorMaThanhPho = "";

        }
        //$scope.ErrorMaThanhPho = "";
        var data = {
            MaHuyen: $scope.Data.MaThanhPho,
        };
        var response = $http({
            url: "/Pay/LoadDistrict",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            debugger
            $scope.ListDistrict = res.data.result;

        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });

        
    }

    //Đặt hàng
    $scope.Order = function () {
        debugger
        if ($scope.Data.Ten== null || $scope.Data.Ten== "") {
            $scope.ErrorTen = "Vui lòng nhập tên";
            return
        }
        else if ($scope.Data.TenDem == null || $scope.Data.TenDem == "") {
            $scope.ErrorTenDem = "Vui lòng nhập tên đệm";
            return
        }
        else if ($scope.Data.DiaChi == null || $scope.Data.DiaChi == "") {
            $scope.ErrorDiaChi = "Vui lòng nhập địa chỉ";
            return
        }
        else if ($scope.Data.MaThanhPho == null || $scope.Data.MaThanhPho == "") {
            $scope.ErrorMaThanhPho = "Vui lòng chọn tỉnh/thành phố";
            return
        }
        else if ($scope.Data.MaHuyen == null || $scope.Data.MaHuyen == "") {
            $scope.ErrorMaHuyen = "Vui lòng chọn quận/huyện";
            return
        }
        else if ($scope.Data.SDT == null || $scope.Data.SDT == "") {
            $scope.ErrorSDT = "Vui lòng nhập số điện thoại";
            return
        }
        else if ($scope.Data.Gmail == null || $scope.Data.Gmail == "") {
            $scope.ErrorGmail = "Vui lòng nhập Gmail";
            return
        }
        var vnf_regex = /(09|01[2|6|8|9])+([0-9]{8})\b/;
        if (vnf_regex.test($scope.Data.SDT) == false) {
            $scope.ErrorSDT = "Số điện thoại không đúng định dạng";
            return;
        }
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ($scope.Data.Gmail == null || $scope.Data.Gmail == "") {
            $scope.ErrorGmail = "Vui lòng nhập Gmail";
            return;
        }

        else if (!re.test($scope.Data.Gmail)) {
            $scope.ErrorGmail = "Gmail sai định dạng";
            return;
        }
        else {
            $(function () {
                var $body = $('body');
                $body.showLoading();

                $scope.ErrorTen = "";
                $scope.Data.TenKH = $scope.Data.Ten + " " + $scope.Data.TenDem;

                debugger
                if ($scope.Data.PhuongThuc == "0" && $scope.Data.MaThanhPho == "1") {
                    $scope.Data.PhiShip = "15000";
                    $scope.Data.TrangThaiThanhToan = 0;
                }
                if ($scope.Data.PhuongThuc == "0" && $scope.Data.MaThanhPho != "1") {
                    $scope.Data.PhiShip = "35000";
                    $scope.Data.TrangThaiThanhToan = false;
                }
                if ($scope.Data.PhuongThuc == "1") {
                    $scope.Data.PhiShip = 0;
                    $scope.Data.TrangThaiThanhToan = true;
                }
               

                var response = $http({
                    url: "/Pay/Order",
                    method: "POST",
                    data: JSON.stringify($scope.Data),
                    dataType: "json"
                });
                response.then(function (res) {
                    if (res.data.result.IsSuccess == true) {

                        debugger
                        setTimeout(function () {
                            $body.hideLoading();

                            swal({
                                title: "Thank you",
                                text: "Bạn đã gửi đơn hàng thành công! Click OK để xem chi tiết đơn hàng.",
                                type: "success",
                                showCancelButton: true,
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "OK!",
                                cancelButtonText: "Về trang chủ",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = "/PayDetail/Index/";
                                } else {
                                    window.location.href = "/HomeShop/Index";
                                }
                            });
                        }, 5000);
                    }


                }, function (res) {
                    $body.hideLoading();
                    AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
                });
            });
        }
       
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

    $scope.ChangeTen = function () {
        if ($scope.Data.Ten == null || $scope.Data.Ten == "") {
            $scope.ErrorTen = "Vui lòng nhập tên";
            return;
        }
        else {
            $scope.ErrorTen = "";
        }
    }

    $scope.ChangeTenDem = function () {
        if ($scope.Data.TenDem == null || $scope.Data.TenDem == "") {
            $scope.ErrorTenDem = "Vui lòng nhập tên đệm";
            return;
        }
        else {
            $scope.ErrorTenDem = "";
        }
    }

    $scope.ChangeDiaChi = function () {
        if ($scope.Data.DiaChi == null || $scope.Data.DiaChi == "") {
            $scope.ErrorDiaChi = "Vui lòng nhập địa chỉ";
            return;
        }
        else {
            $scope.ErrorDiaChi = "";
        }
    }

    $scope.ChangeHuyen = function () {
        if ($scope.Data.MaHuyen != null || $scope.Data.MaHuyen != "") {
            $scope.ErrorMaHuyen = "";
        }
        
    }

    $scope.ChangeSDT = function () {
        
        var vnf_regex = /(09|01[2|6|8|9])+([0-9]{8})\b/;
        if ($scope.Data.SDT == null || $scope.Data.SDT == "") {
            $scope.ErrorSDT = "Vui lòng nhập số điện thoại";
            return;
        }
        else if (vnf_regex.test($scope.Data.SDT) == false) {           
            $scope.ErrorSDT = "Số điện thoại không đúng định dạng";
            return;
        }
        else {
            $scope.ErrorSDT = "";
            $scope.Data.SDT = $scope.Data.SDT;
        }
    }

    $scope.ChangeGmail = function () {
        
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ($scope.Data.Gmail == null || $scope.Data.Gmail == "") {
            $scope.ErrorGmail = "Vui lòng nhập Gmail";
            return;
        }

        else if (!re.test($scope.Data.Gmail)) {
            $scope.ErrorGmail = "Gmail sai định dạng";
            return;
        }
        else {
            $scope.ErrorGmail = "";
        }
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