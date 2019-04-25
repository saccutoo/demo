var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr','ngSanitize']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Data = {};
    $scope.RepData={};
    $scope.iSoLuong = "1";
    $scope.Login = true;
    $scope.isShowLoadMore = true;
    $scope.ColorLike="color:black";
    $scope.DisLike="color:black";
    $scope.ColorRepLike="color:black";
    $scope.ColorRepLike="color:black";
    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.GetListShopCart();
        $scope.LoginCheck();
        $scope.Detail();
        $scope.LoadSanPhamTuongTu();
        $scope.GetALLLoaiSP();
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
                $scope.Login = false;
                $scope.Logout = true;
                $scope.MyAccount = true;
                $scope.TenKH = res.data.result[0].TenKH;
                $scope.Data.TenNguoiBinhLuan = res.data.result[0].TenKH;
                $scope.Data.Gmail = res.data.result[0].Gmail;

                $scope.RepData.TenNguoiBinhLuan = res.data.result[0].TenKH;

                $scope.TenLogin=res.data.result[0].TenKH;
            }

        }, function myError(res) {
        });
    }

    //Lấy toàn bộ loại sản phẩm
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

    //lấy chi tiết sản phẩm và list coment
    $scope.Detail = function () {        
        var ID = content;
        $http({
            url: "/Detail/GetDetail/" + ID,
            method: 'GET'
        }).then(function mySuccess(res) {
            $scope.GetDetail = res.data.result[0];
            $scope.BinhLuan = res.data.result[0].BINHLUAN;
            
            $scope.MaSP = $scope.GetDetail.MaSP;
            $scope.MaLoai = $scope.GetDetail.MaLoai;
            $scope.HinhAnh = $scope.GetDetail.HinhAnh;
            $scope.TenSP = $scope.GetDetail.TenSP;
            $scope.GiaBan = $scope.GetDetail.GiaBan;
            $scope.GioiThieu1 = $scope.GetDetail.MOTASANPHAM[0].GioiThieu1;
            $scope.GioiThieu2 = $scope.GetDetail.MOTASANPHAM[0].GioiThieu2;
            $scope.TenNCC = $scope.GetDetail.NHACC.TenNCC;
            
            $scope.SoLuong = $scope.GetDetail.SoLuong;
            if ($scope.GetDetail.BINHLUAN.length != 0 || $scope.GetDetail.BINHLUAN != null) {
                for (var i = 0; i < $scope.GetDetail.BINHLUAN.length; i++) {
                    //$scope.GetDetail.BINHLUAN[i].NgayBinhLuan = $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.slice(0, 10);
                    var list = $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.split("T");
                    var date = list[0].split("-");
                    date = date[2] + "/" + date[1] + "/" + date[0];
                    $scope.GetDetail.BINHLUAN[i].NgayBinhLuan = date + " " + list[1];
                    $scope.GetDetail.BINHLUAN[i].NgayBinhLuan = $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.slice(0, 19) 
                    
                    // $scope.GetDetail.BINHLUAN[i].NgayBinhLuan=jQuery.timeago(new Date($scope.GetDetail.BINHLUAN[i].NgayBinhLuan))
                    //     var TimeAgo=$scope.GetDetail.BINHLUAN[i].NgayBinhLuan;
                    //     if(TimeAgo=="less than a minute ago"){
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan="Nhỏ hơn 1 phút";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("minutes ago")
                    //     if(position!=-1){
                    //         var list=$scope.GetDetail.BINHLUAN[i].NgayBinhLuan.split(" ");
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan=list[0]+ " " +"phút trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("about an hour ago")
                    //     if(position!=-1){
                    //         $scope.$scope.GetDetail.BINHLUAN[i].NgayBinhLuan="1 giờ trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("hours ago")
                    //     if(position!=-1){
                    //         var list=$scope.GetDetail.BINHLUAN[i].NgayBinhLuan.split(" ");
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan=list[1]+ " "+"giờ trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("a day ago")
                    //     if(position!=-1){
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan="1 ngày trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("days ago")
                    //     if(position!=-1){
                    //         var list=$scope.GetDetail.BINHLUAN[i].NgayBinhLuan.split(" ");
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan=list[0]+ " "+"ngày trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("about a month ago")
                    //     if(position!=-1){
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan="1 tháng trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("months ago")
                    //     if(position!=-1){
                    //         var list=$scope.GetDetail.BINHLUAN[i].NgayBinhLuan.split(" ");
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan=list[0]+ " "+"tháng trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("about a year ago")
                    //     if(position!=-1){
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan="1 năm trước";
                    //     }
                    //     var position= $scope.GetDetail.BINHLUAN[i].NgayBinhLuan.indexOf("years ago")
                    //     if(position!=-1){
                    //         var list=$scope.GetDetail.BINHLUAN[i].NgayBinhLuan.split(" ");
                    //         $scope.GetDetail.BINHLUAN[i].NgayBinhLuan=list[0]+ " "+"năm trước";
                    //     }
                }
            }
            debugger
            for(var i = 0; i < $scope.GetDetail.BINHLUAN.length; i++){
                $scope.GetDetail.BINHLUAN[i].LoadMore=true;
                $scope.GetDetail.BINHLUAN[i].CountRep= $scope.GetDetail.BINHLUAN[i].RepBinhLuan.length;
                $scope.CountRep=$scope.GetDetail.BINHLUAN[i].RepBinhLuan.length;
                if ($scope.CountRep>0){
                    for(var j = 0; j < $scope.GetDetail.BINHLUAN[i].RepBinhLuan.length; j++){
                        var list=$scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NoiDung.split(":")
                        $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].Tag=list[0];
                        $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NoiDung=list[1];

                        var list = $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.split("T");                                              
                        // $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan = list[0] + " " + list[1];

                        $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan=jQuery.timeago(new Date($scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan))
                        var TimeAgo=$scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan;
                        if(TimeAgo=="less than a minute ago"){
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan="Nhỏ hơn 1 phút";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("minutes ago")
                        if(position!=-1){
                            var list=$scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.split(" ");
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan=list[0]+ " " +"phút trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("about an hour ago")
                        if(position!=-1){
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan="1 giờ trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("hours ago")
                        if(position!=-1){
                            var list=$scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.split(" ");
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan=list[1]+ " "+"giờ trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("a day ago")
                        if(position!=-1){
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan="1 ngày trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("days ago")
                        if(position!=-1){
                            var list=$scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.split(" ");
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan=list[0]+ " "+"ngày trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("about a month ago")
                        if(position!=-1){
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan="1 tháng trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("months ago")
                        if(position!=-1){
                            var list=$scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.split(" ");
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan=list[0]+ " "+"tháng trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("about a year ago")
                        if(position!=-1){
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan="1 năm trước";
                        }
                        var position= $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.indexOf("years ago")
                        if(position!=-1){
                            var list=$scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan.split(" ");
                            $scope.GetDetail.BINHLUAN[i].RepBinhLuan[j].NgayBinhLuan=list[0]+ " "+"năm trước";
                        }
                    }
                }                                
            }
            
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
            toastr.error("lỗi rồi....", 'Error',3000);
        });
    }

    $scope.AddCart2 = function () {
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
            iMaSP: content,
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

    $scope.ChangeNoiDung = function () {
        if ($scope.Data.NoiDung == "" || $scope.Data.NoiDung == null) {
            $scope.ErrorNote = "Nội dung không được để trống";
        }
        else {
            $scope.ErrorNote = "";
        }
    }

    $scope.ChangeTenNguoiBinhLuan = function () {
        if ($scope.Data.TenNguoiBinhLuan == "" || $scope.Data.TenNguoiBinhLuan == null) {
            $scope.ErrorName = "Tên không được để trống";
        }
        else {
            $scope.ErrorName = "";
        }
    }

    //Gửi bình luận
    $scope.btnSend = function () {
        if ($scope.Data.NoiDung == "" || $scope.Data.NoiDung == null) {
            $scope.ErrorNote = "Nội dung không được để trống";
            return;
        }
        else if ($scope.Data.TenNguoiBinhLuan == "" || $scope.Data.TenNguoiBinhLuan == null) {
            $scope.ErrorName = "Tên không được để trống";
            return;
        }
        else {
            $scope.Data.MaSP = content;
            var response = $http({
                url: "/Detail/AddComment",
                method: "POST",
                data: JSON.stringify($scope.Data),
                dataType: "json"
            });
            response.then(function (res) {
                if (res.data.messenger.IsSuccess == true) {
                    // swal("Thank you", "Cảm ơn bạn đã để lại lời bình luận.Bình luận của bạn sẽ được duyệt sớm nhất có thể xin chân thành cảm ơn!!!.", "success")
                    toastr.success("Cảm ơn bạn đã để lại nhận xét!!!", 'Success');
                    $scope.Data = [];
                    $scope.Detail();
                }
                else {
                    toastr.error(res.data.messenger.Message, 'Error');
                    $scope.Detail();
                }
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        }
    }

    //Load toàn bộ sản phẩm theo loại
    $scope.LoadSanPhamTuongTu = function () {        
        var Status = 3;
        $scope.Count = 0;
        var data = {
            SL: 0,
            Status: Status,
            MaSP: content,
        }
        var response = $http({
            url: "/Detail/LoadSanPhamTuongTu",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListSanPham = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideMore = true;
            }
            else {
                $scope.isShowHideMore = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });

    }

    //hiển thị thêm sản phẩm
    $scope.LoadMore = function () {
        var SL = $scope.Count + 4;
        var Status = 1;
        var SoLe = SL / 4;
        var data = {
            SL: SL,
            Status: Status,
            MaSP: content,
        }
        var response = $http({
            url: "/Detail/LoadSanPhamTuongTu",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
        debugger
            $scope.ListSanPham = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideMore = true;
            }
            else {
                $scope.isShowHideMore = false;
            }
            if (res.data.messenger.IsSuccess == true) {
                $scope.isShowLoadMore = false;
            }
            else {
                $scope.isShowHideMore = true;
            }
            
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
        });
    }

    //Ẩn bớt sản phẩm
    $scope.HideMore = function () {
        debugger
        $scope.isShowLoadMore = true;
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
            MaSP: content,
        }
        var response = $http({
            url: "/Detail/LoadSanPhamTuongTu",
            method: "POST",
            data: JSON.stringify(data),
            dataType: "json"
        });
        response.then(function (res) {
            $scope.ListSanPham = res.data.result;
            $scope.Count = res.data.result.length;
            if ($scope.Count > 4) {
                $scope.isShowHideMore = true;
            }
            else {
                $scope.isShowHideMore = false;
            }
        }, function (res) {
            AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
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

    $scope.ClickRep = function (list) {
        debugger
        list.RepData={};
        list.loading = true;
        // $scope.Rep = false;
        list.Rep=false;
        list.HideRep = true;
        list.ErrorRepND = "";
        list.ErrorTenNguoiBinhLuan = "";
        if($scope.TenLogin!=null){
            list.RepData.TenNguoiBinhLuan=$scope.TenLogin;
        }
        list.RepData.RepND="#"+list.TenNguoiBinhLuan + ":"+" ";

    }
    $scope.ClickHideRep = function (list) {
        list.RepData={};
        list.loading = false;
        list.Rep=true;
        list.HideRep = false;
        list.ErrorRepND = "";
        list.ErrorTenNguoiBinhLuan = "";

    }

    $scope.btnRep = function (list) {
    list.RepData.MaBinhLuan=list.MaBinhLuan;
    debugger;
    if (list.RepData.RepND == null || list.RepData.RepND == "") {
            list.ErrorRepND="Bạn chưa nhập nội dung.";
            return
        }
    else if (list.RepData.TenNguoiBinhLuan == null || list.RepData.TenNguoiBinhLuan == "") {
            list.ErrorTenNguoiBinhLuan="Bạn chưa nhập tên.";
            return
        }
        else{
            list.ErrorRepND="";
            list.ErrorTenNguoiBinhLuan = "";
            list.RepData.NoiDung= list.RepData.RepND;
            var response = $http({
                url: "/Detail/DetailRepComment",
                method: "POST",
                data: JSON.stringify(list.RepData),
                dataType: "json"
            });
            response.then(function (res) {
                if (res.data.messenger.IsSuccess == true) {
                    toastr.success("Bình luận thành công!!!", 'Success');
                    $scope.GetListShopCart();
                    $scope.Detail();
                }
                else {
                    toastr.error(res.data.messenger.Message, 'Error');
                    $scope.GetListShopCart();
                    $scope.Detail();

                }
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        }
    }

    $scope.ChangeRepND=function(list){
        if (list.RepData.RepND == null || list.RepData.RepND == "") {
            list.ErrorRepND="Bạn chưa nhập nội dung.";
            return
        }
       else{
        list.ErrorRepND="";
       }
    }

    $scope.ChangeTenNguoiBinhLuan=function(list){
        if (list.RepData.TenNguoiBinhLuan == null || list.RepData.TenNguoiBinhLuan == "") {
            list.ErrorTenNguoiBinhLuan="Bạn chưa nhập tên.";
            return
        }
       else{
        list.ErrorTenNguoiBinhLuan="";
       }
    }

    $scope.btnLoadMore=function(list){
        list.LoadMore=false;
        list.HideMore=true;
    }

    $scope.btnHideMore=function(list){
        list.LoadMore=true;
        list.HideMore=false;
    }

    $scope.ClickRepRep=function(ListRep){
        debugger
        ListRep.ErrorTenNguoiBinhLuan="";
        ListRep.ErrorRepND="";
        ListRep.RepData={};
        ListRep.loading=true;
        ListRep.HideRep=true;
        ListRep.Rep=false;
        if($scope.TenLogin!=null){
            ListRep.RepData.TenNguoiBinhLuan=$scope.TenLogin;
        }
        ListRep.RepData.RepND="#"+ListRep.TenNguoiBinhLuan + ":"+" ";
    }
    $scope.ClickHideRepRep=function(ListRep){
        ListRep.ErrorTenNguoiBinhLuan="";
        ListRep.ErrorRepND="";
        ListRep.RepData={};
        ListRep.loading=false;
        ListRep.HideRep=false;
        ListRep.Rep=true;
    }

    $scope.btnRepRep=function(list,ListRep){
        ListRep.RepData.MaBinhLuan=ListRep.MaBinhLuan;
        if (ListRep.RepData.RepND == null || ListRep.RepData.RepND == "") {
                ListRep.ErrorRepND="Bạn chưa nhập nội dung.";
                return
        }       
        else if (ListRep.RepData.TenNguoiBinhLuan == null || ListRep.RepData.TenNguoiBinhLuan == "") {
                ListRep.ErrorTenNguoiBinhLuan="Bạn chưa nhập tên.";
                return
        }
        else{
            ListRep.RepData.MaBinhLuan=ListRep.MaBinhLuan;       
            ListRep.RepData.NoiDung= ListRep.RepData.RepND;
            var response = $http({
                url: "/Detail/DetailRepComment",
                method: "POST",
                data: JSON.stringify(ListRep.RepData),
                dataType: "json"
            });
            response.then(function (res) {
                if (res.data.messenger.IsSuccess == true) {
                    toastr.success("Bình luận thành công!!!", 'Success');
                    $scope.GetListShopCart();
                    $scope.Detail();
                    setTimeout(function(){
                        debugger
                        list.HideMore=true;
                        list.LoadMore=false;
                    }, 1200);

                    
                }
                else {
                    toastr.error(res.data.messenger.Message, 'Error');
                    $scope.GetListShopCart();
                    $scope.Detail();

                }
            }, function (res) {
                AppendToToastr(false, "Thông báo", "... Lỗi rồi !");
            });
        }
    }

    $scope.ChangeRepRepND=function(ListRep){
        debugger
        if (ListRep.RepData.RepND == null || ListRep.RepData.RepND == "") {
            ListRep.ErrorRepND="Bạn chưa nhập nội dung.";
            return
        }
        else{
            ListRep.ErrorRepND="";
        }
    }
    $scope.ChangeRepRepTenNguoiBinhLuan=function(ListRep){
        debugger
        if (ListRep.RepData.TenNguoiBinhLuan == null || ListRep.RepData.TenNguoiBinhLuan == "") {
            ListRep.ErrorTenNguoiBinhLuan="Bạn chưa nhập tên.";
            return
        }      
        else{
            ListRep.ErrorTenNguoiBinhLuan="";
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