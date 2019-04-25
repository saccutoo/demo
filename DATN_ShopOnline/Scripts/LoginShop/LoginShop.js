var app = angular.module('myApp', ['toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.Login = true;
    $scope.data = {};
    $scope.HomeShopActive = "active";

    //Khởi tạo các hàm khi bắt đầu chạy giao diện
    $scope.init = function () {
        //các hàm khởi tạo
        $scope.GetALLLoaiSP();
        $('.isShowheader').css('display', 'block');

    }

    
    //Lấy quyền hiển thị giao diện từ bảng nhân viên
    $scope.btnLogin = function () {
        var modal = new FormData();
        modal.append('TaiKhoan1', $scope.TaiKhoan);
        modal.append('MatKhau', $scope.MatKhau);
        var request = {
            method: 'POST',
            url: "/LoginShop/Login/",
            data: modal,
            headers: {
                'Content-Type': undefined
            }
        }
        $http(request)
          .then(function mySuccess(res) {
              debugger
              if (res.data.messenger.IsSuccess == false) {
                  toastr.error(res.data.messenger.Message, 'Error');
              }
              if (res.data.messenger.IsSuccess == true) {
                  if (res.data.messenger.Message != "") {
                      location.href = res.data.messenger.Message;
                  }
                  else {
                      location.href = "/HomeShop/Index";
                  }

              }
          }, function myError(res) {
              //$scope.load();
          });

    }

    //lấy list sản phẩm
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


    //window.fbAsyncInit = function () {
        
    //    FB.init({
    //        appId: '551315728695536',
    //        //cookie: true,
    //        xfbml: true,
    //        version: 'v3.2',
    //        status: true
    //    });

    //    FB.getLoginStatus(function (response) {
    //        if (response.status === 'connected') {
    //            console.log("connected");

    //            //FB.api('/me', function (response) {
    //            //    console.log(JSON.stringify(response));
    //            //});              
              
    //        }
    //        else if (response.status === 'not_authorized') {
    //            console.log("not_authorized");
    //        }
    //        else {
    //            console.log("chưa login");
    //        }
    //    }, true);

    //};

    //(function (d, s, id) {
    //    var js, fjs = d.getElementsByTagName(s)[0];
    //    if (d.getElementById(id)) { return; }
    //    js = d.createElement(s); js.id = id;
    //    js.src = "https://connect.facebook.net/en_US/sdk.js";
    //    fjs.parentNode.insertBefore(js, fjs);
    //}(document, 'script', 'facebook-jssdk'));


    ////click button login
    //$scope.checkLoginState = function () {
    //    FB.login(function(res){
    //        if(res.authResponse){
    //            FB.api('/me', 'GET', { fields: 'email,first_name,name,id,picture' }, function (res) {
    //                $scope.$apply(function () {
    //                    $scope.name = res.name;
    //                    console.log($scope.name)
    //                    console.log(res.id)

    //                });
    //            });
    //        }
    //    });
    //};
    //$scope.Logout = function () {
    //    FB.logout(function (response) {
    //        alert("logged out");
    //        window.location.reload();
    //    });
    //}

   

    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        debugger
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    }

    function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
    function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
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