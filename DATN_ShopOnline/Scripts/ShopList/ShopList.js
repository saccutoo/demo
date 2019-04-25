
var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Data = {};
    $scope.Login = true;
    $scope.ShopListActive = "active";
    $scope.FindData = [];
    $scope.serach = search;

    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        //$scope.Login();
        $scope.LoginCheck();
        $scope.GetListShopCart();
        $scope.GetALLLoaiSP();
        setTimeout(function () {
            $scope.CheckList();
            $scope.Check();
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

    //kiểm tra check để load sản phẩm
    $scope.CheckList = function () {
        debugger
        if (IDMaLoai != 0 || IDMaLoai!=null) {
            var checkbox = document.getElementsByName('Check');
            for (var i = 0; i < checkbox.length; i++) {
                if (checkbox[i].value == IDMaLoai) {
                    document.getElementById(IDMaLoai).checked = true;
                }
                else {
                    document.getElementById(checkbox[i].value).checked = false;
                }
            }
        }
        else {
            var checkbox = document.getElementsByName('Check');
            for (var i = 0; i < checkbox.length; i++) {
                document.getElementById(checkbox[i].value).checked = true;

            }
        }
    }

    //Lấy toàn bộ loại sản phẩm
    $scope.GetALLLoaiSP = function () {
        $http({
            url: "/HomeShop/GetALLLoaiSP",
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.ListLoaiSP = res.data.result;

        }, function myError(res) {
        });
    }

    //Click vào checkbox
    $scope.Check = function () {
        $scope.btnTimKiem();        
    }

    //Click vào ten checkbox
    $scope.ChangeCheck = function (content) {
        if (document.getElementById(content).checked == true) {
            document.getElementById(content).checked = false;
            $scope.btnTimKiem();
        }
        else {
            document.getElementById(content).checked = true;
            $scope.btnTimKiem();
        }
    }

    //Tìm kiếm sản phẩm
    $scope.btnTimKiem = function () {
        $scope.FindData.checklist = [];
        debugger
        var checkbox = document.getElementsByName('Check');
        for (var i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked === true) {
                $scope.FindData.checklist.push(checkbox[i].value);
            }
        }        
        if ($scope.FindData.GiaTu == "" || $scope.FindData.GiaTu == null) {
            $scope.FindData.GiaTu = 0;
        }
        if ($scope.FindData.GiaDen == "" || $scope.FindData.GiaDen == null) {
            $scope.FindData.GiaDen = 0;
        }
        if (search == null || search=="") {
            var data = {
                GiaTu: $scope.FindData.GiaTu,
                GiaDen: $scope.FindData.GiaDen,
                data: $scope.FindData.checklist,
            }
            var response = $http({
                url: "/ShopList/TimKiem",
                method: "POST",
                data: data,
                dataType: "json"
            });
            response.then(function (res) {
                $scope.ListSanPham = res.data.result;
                //for (var i = 0; i < $scope.ListSanPham.length; i++) {
                //    document.getElementById($scope.ListSanPham[i].MaLoai).checked = true;
                //}
                $('.sanpham').css('display', 'block');

            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        }
        else {
            var data = {
                search: search,
            }
            var response = $http({
                url: "/ShopList/Search",
                method: "POST",
                data: data,
                dataType: "json"
            });
            response.then(function (res) {
                $scope.ListSanPham = res.data.result;
                for (var i = 0; i < $scope.ListSanPham.length; i++) {
                    document.getElementById($scope.ListSanPham[i].MaLoai).checked = true;
                }
                $('.sanpham').css('display', 'block');

            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        }
       
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