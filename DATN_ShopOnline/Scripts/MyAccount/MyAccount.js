
var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Data = {};
    $scope.EditData = {};
    $scope.SaveData = {};
    $scope.Login = true;
    //$scope.HomeShopActive = "active";

    $scope.TrangThaiChoXuLy = "Chờ xử lý";//0  
    $scope.TrangThaiDaXuLy = "Đã xác nhận";//1
    $scope.TrangThaiDangGiaoHang = "Đang giao hàng";//2
    $scope.TrangThaiDaNhanHang = "Đã nhận hàng";//3
    $scope.TrangThaiKhachHuyHang = "Đã hủy";//4

    $scope.TrangThaiDaHoantien = "Đã hoàn tiền";//2
    $scope.TrangThaiDaThanhToan = "Đã thanh toán";//1
    $scope.TrangThaiChuaThanhToan = "Chưa thanh toán";//0

    $scope.isShowOrder = true;
    $scope.isShowOrderDetail = false;

    $scope.isShowEdit = false;

    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.GetALLLoaiSP();
        $scope.GetListShopCart();
        $scope.LoginCheck();
        $scope.LoadCity();
        $scope.LoadDistrict(); 
        $('.isShowheader').css('display', 'block');

    }

    //kiểm tra login
    $scope.LoginCheck = function () {
        $http({
            url: "/HomeShop/Login",
            method: 'GET'
        }).then(function mySuccess(res) {
            if (res.data.messenger.IsSuccess == true) {
                debugger
                $scope.CoppyKH = angular.copy(res.data.result[0]);
                $scope.Login = false;
                $scope.Logout = true;
                $scope.MyAccount = true;
                $scope.TenKH = res.data.result[0].TenKH;
                $scope.Login = false;
                $scope.MaKH = res.data.result[0].MaKH;
                debugger
                $scope.GetListOrder();
                $scope.GetPay();
                $scope.GetCustomer();
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

    //Lấy thông tin đơn hàng của khách hàng
    $scope.GetListOrder = function (ID) {
        
        var ID = $scope.MaKH;
        $http({
            url: "/MyAccount/GetListOrder/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.GetListOrder = res.data.result;

        }, function myError(res) {
        });
    }

    //lấy thông tin chi tiết đơn hàng
    $scope.ViewDetail = function (MaDB) {
        var ID = MaDB;
        $http({
            url: "/MyAccount/GetListOrderDetail/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.isShowOrder = false;
            $scope.isShowOrderDetail = true;
            $scope.GetListOrderDetail = res.data.result;

        }, function myError(res) {
        });
    }

    //trở lại 
    $scope.Comback = function () {
        $scope.isShowOrder = true;
        $scope.isShowOrderDetail = false;
        var ID = $scope.MaKH;
        $http({
            url: "/MyAccount/GetListOrder/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.GetListOrder = res.data.result;

        }, function myError(res) {
        });
    }

    //show các thẻ input select
    $scope.Edit=function(){
        $scope.isShowEdit = true;

    }
    //Hide các thẻ input select

    $scope.OK = function () {
        $scope.EditData = {};
        $scope.isShowEdit = false;
        $scope.LoadDistrict();
        $scope.EditData.DiaChi = $scope.Pay.DiaChi;
        $scope.EditData.MaThanhPho = $scope.Pay.MaThanhPho;
        $scope.EditData.MaHuyen = $scope.Pay.MaHuyen;
    }

    //Load tỉnh thành và mặc định chọn hưng yên
    $scope.LoadCity = function () {
        $http({
            url: "/MyAccount/LoadCity",
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.ListCity = res.data.result;
        }, function myError(res) {
        });
    }

    //mặc định load huyện của hưng yên và mặc định chọn văn lâm
    $scope.LoadDistrict = function () {
        $http({
            url: "/MyAccount/LoadDistrict",
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.ListDistrict = res.data.result;
           

        }, function myError(res) {
        });
    }

    //Load huyện khi chọn tỉnh
    $scope.ChangeCity = function () {
        var data = {
            MaThanhPho: $scope.EditData.MaThanhPho,
        };
        var response = $http({
            url: "/MyAccount/LoadDistrict",
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

    //lấy thông tin thanh toán khách hàng
    $scope.GetPay = function () {
        var ID = $scope.MaKH;
        $scope.EditData.MaKH = $scope.MaKH;
        debugger
        $http({
            url: "/MyAccount/GetPay/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.Pay = angular.copy(res.data.result[0]);
            $scope.GetPay = res.data.result[0];
            $scope.DiaChi = $scope.GetPay.DiaChi;
            $scope.Tinh = $scope.GetPay.THANHPHO.TenThanhPho;
            $scope.Huyen = $scope.GetPay.HUYEN.TenHuyen;

            $scope.EditData.DiaChi = $scope.GetPay.DiaChi;
            $scope.EditData.MaThanhPho = $scope.GetPay.MaThanhPho;
            $scope.EditData.MaHuyen = $scope.GetPay.MaHuyen;

        }, function myError(res) {
        });
    }

    //lưu lại thông thanh toán tin khách hàng
    $scope.SavePay = function () {
        if ($scope.EditData.DiaChi == null || $scope.EditData.DiaChi == "") {
            toastr.error("Vui lòng nhập địa chỉ của bạn", 'Error');
            return;
        }
        else if ($scope.EditData.MaThanhPho == null || $scope.EditData.MaThanhPho == "") {
            toastr.error("Vui lòng chọn thành phố của bạn", 'Error');
            return;
        }
        else if ($scope.EditData.MaHuyen == null || $scope.EditData.MaHuyen == "") {
            toastr.error("Vui lòng chọn huyện của bạn", 'Error');
            return;
        }
        else {
            debugger
            var $body = $('body');
            $body.showLoading();
            debugger

            var data = {
                data: $scope.EditData,
            };
            var response = $http({
                url: "/MyAccount/SavePay",
                method: "POST",
                data: JSON.stringify(data),
                dataType: "json"
            });
            response.then(function (res) {                
                if (res.data.messenger.IsSuccess == true) {

                    var ID = $scope.EditData.MaKH;
                    debugger
                    $http({
                        url: "/MyAccount/GetPay/" + ID,
                        method: 'GET'
                    }).then(function mySuccess(res) {
                       

                        setTimeout(function () {
                            $body.hideLoading();
                            toastr.success("Cập nhập thành công", 'Success');
                            $scope.Pay = angular.copy(res.data.result[0]);
                            $scope.GetPay = res.data.result[0];
                            $scope.DiaChi = $scope.GetPay.DiaChi;
                            $scope.Tinh = $scope.GetPay.THANHPHO.TenThanhPho;
                            $scope.Huyen = $scope.GetPay.HUYEN.TenHuyen;

                            $scope.EditData.DiaChi = $scope.GetPay.DiaChi;
                            $scope.EditData.MaThanhPho = $scope.GetPay.MaThanhPho;
                            $scope.EditData.MaHuyen = $scope.GetPay.MaHuyen;
                            $scope.isShowEdit = false;

                        }, 5000);

                    }, function myError(res) {
                    });
                }
                else {
                    toastr.error(res.data.messenger.Message, 'Error');
                    $body.hideLoading();

                }
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
                $body.hideLoading();

            });
        }
    }

    //lấy thông tin các nhân khách hàng
    $scope.GetCustomer = function () {
        var ID = $scope.MaKH;
        $scope.SaveData.MaKH = $scope.MaKH;
        $http({
            url: "/MyAccount/GetCustomer/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            if (res.data.result[0].GioiTinh != null) {
                if (res.data.result[0].GioiTinh=="Nam") {
                    $scope.CheckNam = true;
                }
                else {
                    $scope.CheckNu = true;
                }
            }
            var ListName = res.data.result[0].TenKH.split(" ");
            if (ListName.length > 2) {
                $scope.SaveData.Ten = ListName[2];
                $scope.SaveData.TenDem = ListName[0] + " " + ListName[1];
            }
            else {
                $scope.SaveData.Ten = ListName[1];
                $scope.SaveData.TenDem = ListName[0];
            }
            if (res.data.result[0].SDT!=null) {
                $scope.SaveData.SDT = res.data.result[0].SDT;
                $scope.SaveData.SDT = 0+""+res.data.result[0].SDT;

            }
            if (res.data.result[0].Gmail != null) {
                $scope.SaveData.Gmail = res.data.result[0].Gmail;
            }
            if (res.data.result[0].NgaySinh != null) {
                $scope.SaveData.NgaySinh1 = formatdate(res.data.result[0].NgaySinh);
            }
           
        }, function myError(res) {
        });
    }

    //Lưu lại thông tin cá nhân khách hàng
    $scope.SaveCustome = function () {
        debugger
        var checkbox = document.getElementsByName('id_gender');
        for (var i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked === true) {
                $scope.SaveData.GioiTinh=checkbox[i].value;
            }
            
        }

        if ($scope.SaveData.Ten == null || $scope.SaveData.Ten == "") {
            toastr.error("Vui lòng nhập tên của bạn", 'Error');
            return;
        }
        if ($scope.SaveData.TenDem == null || $scope.SaveData.TenDem == "") {
            toastr.error("Vui lòng nhập tên dêm hoặc họ của bạn", 'Error');
            return;
        }
        if ($scope.SaveData.SDT != null || $scope.SaveData.SDT != "") {
            var vnf_regex = /(09|01[2|6|8|9])+([0-9]{8})\b/;
            if (vnf_regex.test($scope.SaveData.SDT) == false) {
                toastr.error("Số điện thoại không đúng định dạng", 'Error');
                return;
            }
        }
        if ($scope.SaveData.Gmail != null || $scope.SaveData.Gmail != "") {
            var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var Gmail = $scope.SaveData.Gmail;
        }
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (Gmail!=null && !re.test(Gmail)) {
            toastr.error("Gmail không đúng định dạng", 'Error');
            return;
        }
        else {
            var $body = $('body');
            $body.showLoading();
            debugger
            $scope.SaveData.TenKH = $scope.SaveData.TenDem + " " + $scope.SaveData.Ten;
            var date = $scope.SaveData.NgaySinh1.split("/");
            $scope.SaveData.NgaySinh = date[2] + "/" + date[1] + "/" + date[0];
            var data = {
                data: $scope.SaveData,
            };
            var response = $http({
                url: "/MyAccount/SaveCustomer",
                method: "POST",
                data: JSON.stringify(data),
                dataType: "json"
            });
            response.then(function (res) {
                if (res.data.messenger.IsSuccess == true) {                 
                    
                    var ID = $scope.SaveData.MaKH;
                    $http({
                        url: "/MyAccount/GetCustomer/" + ID,
                        method: 'GET'
                    }).then(function mySuccess(res) {                        

                        setTimeout(function () {
                            $body.hideLoading();
                            toastr.success("Cập nhập thành công", 'Success');
                            if (res.data.result[0].GioiTinh != null) {
                                if (res.data.result[0].GioiTinh == "Nam") {
                                    $scope.CheckNam = true;
                                }
                                else {
                                    $scope.CheckNu = true;
                                }
                            }
                            var ListName = res.data.result[0].TenKH.split(" ");
                            if (ListName.length > 2) {
                                $scope.SaveData.Ten = ListName[2];
                                $scope.SaveData.TenDem = ListName[0] + " " + ListName[1];
                            }
                            else {
                                $scope.SaveData.Ten = ListName[1];
                                $scope.SaveData.TenDem = ListName[0];
                            }
                            if (res.data.result[0].SDT != null) {
                                $scope.SaveData.SDT = res.data.result[0].SDT;
                                $scope.SaveData.SDT = 0 + "" + res.data.result[0].SDT;

                            }
                            if (res.data.result[0].Gmail != null) {
                                $scope.SaveData.Gmail = res.data.result[0].Gmail;
                            }
                            if (res.data.result[0].NgaySinh != null) {
                                $scope.SaveData.NgaySinh1 = formatdate(res.data.result[0].NgaySinh);
                            }
                        }, 5000);

                    }, function myError(res) {
                    });

                }
                else {
                    toastr.error(res.data.messenger.Message, 'Error');
                    $body.hideLoading();

                }
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
                $body.hideLoading();

            });
        }
    }

    //hàm format ngày sinh
    function formatdate(str) {
        debugger
        var date = str.slice(0,10)
        var ListDate = date.split("-");
        date = ListDate[2] + "/" + ListDate[1] + "/" + ListDate[0];
        return date;
    }
   
    $scope.Remove=function(list){
        debugger
        if (list.TrangThai==4){
            toastr.error("Đơn hàng đã được hủy.", 'Error');
            return
        }
        else if(list.TrangThaiThanhToan==true){
            toastr.error("Đơn hàng đã thanh toán không thể hủy mong quý khách thông cảm <3.", 'Error');
            return
        }
        else{           
            $scope.MaDB=list.MaDB;
            $('#myModal').modal('show');
        }
    }

    $scope.btnRemoveDB=function(){        
        var $body = $('body');
            $body.showLoading();
        var data={
            MaDB:$scope.MaDB
        }

        var response = $http({
            url: "/MyAccount/RemoveDB",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            if (res.data.messenger.IsSuccess == true) {               
                
                var ID = $scope.MaKH;
                $http({
                    url: "/MyAccount/GetListOrder/" + ID,
                    method: 'GET'
                }).then(function mySuccess(res) {
                    $scope.GetListOrder = res.data.result;                   
                    setTimeout(function () {
                        $body.hideLoading();
                        toastr.success("Đơn hàng đã được hủy", 'Success');
                    },3000);
                }, function myError(res) {
                });
                   
            }
            else {
                toastr.error(res.data.messenger.Message, 'Error');

            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            $body.hideLoading();

        });
    }

    $scope.RemoveCTDH=function(list){
        if (list.TrangThai==4){
            toastr.error("Sản phẩm này đã được hủy.", 'Error');
            return
        }
        else if(list.TrangThaiThanhToan==true){
            toastr.error("Sản phẩm này đã thanh toán không thể hủy mong quý khách thông cảm <3.", 'Error');
            return
        }
        else{
            $scope.MaCTDB=list.MaCTDB;           
            $scope.MaDB=list.MaDB;
            $('#myModalCTDH').modal('show');
        }
    }
    $scope.btnRemoveTDHB=function(){
        var $body = $('body');
        $body.showLoading();
    var data={
        MaCTDB:$scope.MaCTDB,
        MaDB:$scope.MaDB
    }

    var response = $http({
        url: "/MyAccount/RemoveCTDB",
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json"
    });
    response.then(function (res) {

        var ID = $scope.MaDB;
            $http({
                url: "/MyAccount/GetListOrderDetail/" + ID,
                method: 'GET'
            }).then(function mySuccess(res) {
                $scope.GetListOrderDetail = res.data.result;

                setTimeout(function () {
                    $body.hideLoading();
                    toastr.success("Đơn hàng đã được hủy", 'Success');
                    var ID = $scope.MaKH;
                    $http({
                        url: "/MyAccount/GetListOrder/" + ID,
                        method: 'GET'
                    }).then(function mySuccess(res) {
                        $scope.GetListOrder = res.data.result;

                    }, function myError(res) {
                    });
                },3000);

            }, function myError(res) {
            });
    }, function (res) {
        AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        $body.hideLoading();
    });
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


// var $body = $('body');
// $body.showLoading();
// setTimeout(function () {
//    $body.hideLoading();
//    toastr.success("Cập nhập thành công", 'Success');
// }, 5000);