var app = angular.module('myApp', [ 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    
    $scope.data = {};
    //Khởi tạo các hàm khi bắt đầu chạy giao diện
    $scope.init = function () {
        //các hàm khởi tạo
        
    }

    //Lấy quyền hiển thị giao diện từ bảng nhân viên
    $scope.btnLogin = function () {
        var modal = new FormData();
        modal.append('TaiKhoan1', $scope.TaiKhoan1);
        modal.append('MatKhau', $scope.MatKhau);
        var request = {
            method: 'POST',
            url: "/LoginAdmin/Login/",
            data: modal,
            headers: {
                'Content-Type': undefined
            }
        }
        $http(request)
          .then(function mySuccess(res) {
              if (res.data.messenger.IsSuccess==false) {
                  toastr.error(res.data.messenger.Message, 'Error');
              }
              if (res.data.messenger.IsSuccess == true) {
                  toastr.success(res.data.messenger.Message, 'Success');
                  location.href = "/HomeAdmin/Index";
              }
          }, function myError(res) {
              //$scope.load();
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