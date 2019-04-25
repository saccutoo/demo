
var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Data = {};
    $scope.Login = true;    
    $scope.HomeShopActive = "active";
    

    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        //$scope.Login();
        $scope.LoginCheck();
        $scope.LoadVangY();
        $scope.LoadVangPhap();
        $scope.LoadTayBanNha();
        $scope.LoadVangChile();
        $scope.GetALLLoaiSP();
        $scope.GetListShopCart();
        setTimeout(function () {
            $('.sanpham').css('display', 'block');
        }, 1500);
       
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

    //Load toàn bộ VANG Ý
    $scope.LoadVangY = function () {
        var Status = 3;
        $scope.Count = 0;
        var data = {
            SL: 0,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangY",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListSanPham = res.data.result;
            $scope.Count = res.data.result.length;
            $scope.isShowLoadMoreVangY = true;
            if ($scope.Count > 4) {
                $scope.isShowHideMoreVangY = true;
            }
            else {
                $scope.isShowHideMoreVangY = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });

    }

    //hiển thị thêm sản phẩm
    $scope.LoadMoreVangY = function () {

        var SL = $scope.Count + 4;
        var Status = 1;
        var SoLe = SL / 4;
        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangY",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListSanPham = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count >4) {
                $scope.isShowHideMoreVangY = true;
            }
            else {
                $scope.isShowHideMoreVangY = false;
            }
            if (res.data.messenger.IsSuccess ==true) {
                $scope.isShowLoadMoreVangY = false;
            }
            else {
                $scope.isShowHideMoreVangY  = true;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Ẩn bớt sản phẩm
    $scope.HideMoreVangY = function () {
        debugger
        $scope.isShowLoadMoreVangY = true;
        var Status = 0;
        var SoLe = $scope.Count / 4;
        if (SoLe%2==0) {
            SoLe = 0;
            var SL = $scope.Count - 4;
        }
        else {
            SoLe = SoLe.toString().split(".");
            SoLe = SoLe[1];
            if (SoLe == 25) {
                SL = $scope.Count - 1;
            }
            else if (SoLe == 5) {
                SL = $scope.Count - 2;
            }
            else if (SoLe == 75) {
                SL = $scope.Count - 3;
            }
        }              
        
        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangY",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListSanPham = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideMoreVangY= true;
            }
            else {
                $scope.isShowHideMoreVangY = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Load toàn bộ VANG TÂY BAN NHA
    $scope.LoadTayBanNha = function () {
        var Status = 3;
        $scope.Count = 0;
        var data = {
            SL: 0,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangTayBanNha",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangTayBanNha = res.data.result;
            debugger
            $scope.Count = res.data.result.length;
            $scope.isShowLoadVangTayBanNha = true;
            if ($scope.Count > 4) {
                $scope.isShowHideVangTayBanNha = true;
            }
            else {
                $scope.isShowHideVangTayBanNha = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });

    }

    //hiển thị thêm sản phẩm
    $scope.LoadMoreVangTayBanNha = function () {

        var SL = $scope.Count + 4;
        var Status = 1;
        var SoLe = SL / 4;
        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangTayBanNha",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangTayBanNha = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideVangTayBanNha = true;
            }
            else {
                $scope.isShowHideVangTayBanNha = false;
            }
            if (res.data.messenger.IsSuccess == true) {
                $scope.isShowLoadVangTayBanNha = false;
            }
            else {
                $scope.isShowHideVangTayBanNha = true;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Ẩn bớt sản phẩm
    $scope.HideVangTayBanNha = function () {
        $scope.isShowLoadVangTayBanNha = true;
        var Status = 0;
        var SoLe = $scope.Count / 4;
        if (SoLe % 2 == 0) {
            SoLe = 0;
            var SL = $scope.Count - 4;
        }
        else {
            SoLe = SoLe.toString().split(".");
            SoLe = SoLe[1];
            if (SoLe == 25) {
                SL = $scope.Count - 1;
            }
            else if (SoLe == 5) {
                SL = $scope.Count - 2;
            }
            else if (SoLe == 75) {
                SL = $scope.Count - 3;
            }
        }

        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangTayBanNha",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangTayBanNha = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideVangTayBanNha = true;
            }
            else {
                $scope.isShowHideVangTayBanNha = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Load toàn bộ VANG pháp
    $scope.LoadVangPhap= function () {
        var Status = 3;
        $scope.Count = 0;
        var data = {
            SL: 0,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangPhap",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangPhap = res.data.result;
            debugger
            $scope.Count = res.data.result.length;
            $scope.isShowLoadPhap = true;
            if ($scope.Count > 4) {
                $scope.isShowHideVangPhap = true;
            }
            else {
                $scope.isShowHideVangPhap = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });

    }

    //hiển thị thêm sản phẩm
    $scope.LoadMoreVangPhap = function () {

        var SL = $scope.Count + 4;
        var Status = 1;
        var SoLe = SL / 4;
        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangPhap",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangPhap = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideVangPhap = true;
            }
            else {
                $scope.isShowHideVangPhap = false;
            }
            if (res.data.messenger.IsSuccess == true) {
                $scope.isShowLoadPhap = false;
            }
            else {
                $scope.isShowHideVangPhap = true;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Ẩn bớt sản phẩm
    $scope.HideVangPhap = function () {
        $scope.isShowLoadPhap = true;
        var Status = 0;
        var SoLe = $scope.Count / 4;
        if (SoLe % 2 == 0) {
            SoLe = 0;
            var SL = $scope.Count - 4;
        }
        else {
            SoLe = SoLe.toString().split(".");
            SoLe = SoLe[1];
            if (SoLe == 25) {
                SL = $scope.Count - 1;
            }
            else if (SoLe == 5) {
                SL = $scope.Count - 2;
            }
            else if (SoLe == 75) {
                SL = $scope.Count - 3;
            }
        }

        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangPhap",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangPhap = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideVangPhap = true;
            }
            else {
                $scope.isShowHideVangPhap = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Load toàn bộ VANG CHILE
    $scope.LoadVangChile = function () {
        var Status = 3;
        $scope.Count = 0;
        var data = {
            SL: 0,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangChile",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangChile = res.data.result;
            debugger
            $scope.Count = res.data.result.length;
            $scope.isShowLoadVangChile = true;
            if ($scope.Count > 4) {
                $scope.isShowHideVangChile = true;
            }
            else {
                $scope.isShowHideVangChile = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });

    }

    //hiển thị thêm sản phẩm
    $scope.LoadMoreVangChile = function () {

        var SL = $scope.Count + 4;
        var Status = 1;
        var SoLe = SL / 4;
        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangChile",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangChile = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideVangChile = true;
            }
            else {
                $scope.isShowHideVangChile = false;
            }
            if (res.data.messenger.IsSuccess == true) {
                $scope.isShowLoadVangChile = false;
            }
            else {
                $scope.isShowHideVangChile = true;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Ẩn bớt sản phẩm
    $scope.HideVangChile = function () {
        $scope.isShowLoadVangChile = true;
        var Status = 0;
        var SoLe = $scope.Count / 4;
        if (SoLe % 2 == 0) {
            SoLe = 0;
            var SL = $scope.Count - 4;
        }
        else {
            SoLe = SoLe.toString().split(".");
            SoLe = SoLe[1];
            if (SoLe == 25) {
                SL = $scope.Count - 1;
            }
            else if (SoLe == 5) {
                SL = $scope.Count - 2;
            }
            else if (SoLe == 75) {
                SL = $scope.Count - 3;
            }
        }

        var data = {
            SL: SL,
            Status: Status,
        }
        var response = $http({
            url: "/HomeShop/LoadVangChile",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListVangChile = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideVangChile = true;
            }
            else {
                $scope.isShowHideVangChile = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

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
        var ID=content;
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
            if ($scope.ListShopCart==null) {
                $scope.isShowCartHollow = true;
                $scope.CartHollow = "Giỏ hàng không có sản phẩm nào.Mời bạn đặt hàng!!!";
                $scope.isShowButtonCart = false;
            }
            else if($scope.ListShopCart.length==0 ){
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
        if ($scope.iSoLuong<=0) {
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

    //Tìm kiếm sản phẩm

    $scope.ClickSerach = function () {
        debugger

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