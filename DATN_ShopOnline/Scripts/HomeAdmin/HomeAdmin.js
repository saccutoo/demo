var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr


app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {

    $scope.HomeActive = "active";
  
    //Khởi tạo các hàm khi bắt đầu chạy giao diện
    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.Login();
        $scope.Seigneur();
    }

    //Lấy quyền hiển thị giao diện từ bảng nhân viên
    $scope.Seigneur = function () {
        $http({
            url: "/HomeAdmin/XemQuyen",
            method: 'GET'
        }).then(function mySuccess(res) {
       debugger
            if (res.data.result[0].MaChucVu==1) {
                $scope.ShowLSP = true;
                $scope.ShowNCC = true;
                $scope.ShowSP = true;
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
                debugger
                $scope.TenNV = res.data.result[0].TenNV;
                $scope.HinhAnh = res.data.result[0].HinhAnh;
            }
           
        }, function myError(res) {
        });
    }

    // click vào input file hiển thị ảnh lên màn hình
    $("#ctrlFile").change(function () {
        readURL(this);
    });   

    //Map Path ảnh vào thư mục
    $scope.setFile = function (element) {        
        $scope.$apply(function ($scope) {
            $scope.theFile = element.files[0];
            if ($scope.theFile == null || $scope.theFile=="") {
                toastr.error('Bạn chưa chọn file ảnh nào !!!', 'Error');
                $scope.isShowIMG = false;

            }
            else {
                var modal = new FormData();
                modal.append('file', $scope.theFile);
                var request = {
                    method: 'POST',
                    url: "/HomeAdmin/Upload",
                    data: modal,
                    headers: {
                        'Content-Type': undefined
                    }
                }
                $http(request)
                  .then(function mySuccess(res) {
                      toastr.success('Successful ADD !!!', 'Success');
                      //toastr.error('Thêm thất bại !!!', 'Error');
                  }, function myError(res) {
                      //$scope.load();
                  });

            }
           
        });
    };

    //Mở popup modal colorbox
    $scope.ShowPopup = function () {
        
        ShowPopup($, "#ShowPopup", 1000, 600);
    }

    $scope.Send = function () {
        
        if ($scope.car == "" || $scope.car == null) {
            console.log(0)
            
        }
        else {
            console.log($scope.car)
        }
    }

    //đóng popup modal colorbox
    $scope.ClosePopup = function () {
        $scope.data = {};
        $.colorbox.close();
    }

    //thông báo SweetAlter
    $scope.SweetAlter = function () {
        
        swal("Thank you", "Bạn đã gửi đơn hàng thành công! Click OK để xem chi tiết đơn hàng.", "success", {
           
        });
    }

    // thông báo Toastr
    $scope.Toastr = function () {
        toastr.error('Đặt hàng thất bại', 'Error');
    }

    //Load more
    $('.list .loadMore').loadMoreResults();

    // slick slider
   

    //Post tìm kiếm

    //$scope.Find = function () {
    //    var modal = new FormData();
    //    modal.append('FindTenSP', $scope.FindTenSP);
    //    modal.append('FindGiaBD', $scope.FindGiaBD);
    //    modal.append('FindGiaKT', $scope.FindGiaKT);
    //    var request = {
    //        method: 'POST',
    //        url: "/Home/UngularHome/JsonHome",
    //        data: modal,
    //        headers: {
    //            'Content-Type': undefined
    //        }
    //    }
    //    $http(request)
    //      .then(function mySuccess(res) {
              
    //      }, function myError(res) {
    //          //$scope.load();
    //      });
    //}
  

    //Thư viện

    //$(function () {
    //    var $body = $('body');

    //    $body.showLoading();

    //    $body.hideLoading();

    //});

    //$('.clockpicker').clockpicker({
    //    align: 'right',
    //    autoclose: true
    //});

    //inputmask format time

    //$('#TimeOff').inputmask({ mask: "99:99" });

    //inputmask format money

    // $('#good').inputmask("numeric", {
    //     radixPoint: ".",
    //     groupSeparator: ",",
    //     digits: 2,
    //     autoGroup: true,
    //     rightAlign: false,
    //     oncleared: function () { self.Value(''); }
    // });


    //var endYear = new Date(new Date().getFullYear(), 11, 31);
    //$(".datePicker123").datepicker({
    //    autoclose: true,
    //    format: "mm/yyyy",
    //    startDate: "1/2013",
    //    endDate: endYear,
    //    startView: "months",
    //    minViewMode: "months",
    //    maxViewMode: "years"
    //}).datepicker("setDate", new Date());

    

    // Lấy danh sách ngày trong khoảng từ ngày 9 đến 14  
    function BeetwenDate(str1,str2) {
        const dateToString = d => `${d.getFullYear()}-${('00' + (d.getMonth() + 1)).slice(-2)}-${('00' + d.getDate()).slice(-2)}`
        let initialTime = new Date(str1)
           , endTime = new Date(str2)
           , arrTime = []
           , dayMillisec = 24 * 60 * 60 * 1000
        ;
        for (let q = initialTime; q <= endTime; q = new Date(q.getTime() + dayMillisec)) {

            const myDate = new Date(Date.parse(q));
            arrTime.push(dateToString(myDate));
        }
    }   

    // Hàm lấy danh sách ngày trong 1 tháng bất kì và cắt ghép ngày tháng
    function getDaysInMonth(month, year) {
        var list = [];
        var days = [];
        var date = new Date(year, month, 1);
        var a = {};
        while (date.getMonth() === month) {
            a = { day: new Date(date) }
            days.push(a);
            date.setDate(date.getDate() + 1);

        }

        //cắt ngày tháng
        for (var i = 0; i < days.length; i++) {

            var day = { Mon: "T2", Tue: "T3", Wed: "T4", Thu: "T5", Fri: "T6", Sat: "T7", Sun: "CN" };
            var month = {
                Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
                Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
            };

            var n = days[i].day.toString();
            var date = n.split(" ");

            var v = day[date[0]] + " - " + [date[2], month[date[1]], date[3]].join("/");

            list.push(v);
        }
        return list;
    }


    //lấy danh sách ngày trong tuần hiện tại
    function WeekNow() {
        var list = [];
        var week = [];
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay();
        var firstday = (new Date(curr.setDate(first + 1))).toString();
        for (var i = 1; i < 8; i++) {
            var next = new Date(curr.getTime());
            week.push(next);
            next.setDate(first + i);
        }

        //Cắt ghép ngày
        for (var i = 0; i < week.length; i++) {

            var day = { Mon: "T2", Tue: "T3", Wed: "T4", Thu: "T5", Fri: "T6", Sat: "T7", Sun: "CN" };
            var month = {
                Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
                Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
            };

            var n = week[i].toString();
            var date = n.split(" ");

            var v = day[date[0]] + " - " + [date[2], month[date[1]], date[3]].join("/");

            list.push(v);
        }
        return list
    }

    //Tính tổng tuần trong 1 tháng
    function TotalWeek(year, month) {
        // month_number is in the range 1..12
        var firstOfMonth = new Date(year, month - 1, 1);
        var lastOfMonth = new Date(year, month, 0);

        var used = firstOfMonth.getDay() + 6 + lastOfMonth.getDate();

        return Math.ceil(used / 7);
    }

    // format tiền VNĐ theo định dạng 0,000
    function FormatMoney(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //nối chuỗi tiền sau khi cắt 0,000 ->0000
    function joinMoney(value) {
        var list = value.split(",");
        return list.join("");
    }

    //Hàm lấy dữ liệu và hiển thị ảnh
    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#dispImg').attr('src', e.target.result);
                $scope.isShowIMG = true;

            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    //định dạng input type file
    $('#ctrlFile').filestyle({
        'text' : 'Chọn ảnh',
        'htmlIcon' : '',
        'btnClass' : 'btn-primary',
        'size' : 'nr',
        'input' : true,
        'badge' : true,
        'badgeName': 'badge-light',
        'buttonBefore' : false,
        'disabled' : false,
        'placeholder': '',
        'onChange': function () {}
});

    //Tính tổng số ngày trong khaoảng ngày bất kì 
    function TotalDay(StartDay, EndDate) {
        var x = StartDay.split('/');
        var y = EndDate.split('/');
        var a = new Date(x[2], x[1], x[0]);
        var b = new Date(y[2], y[1], y[0]);
        var c = (b - a);
        var songaytinh = c / (1000 * 60 * 60 * 24);
    }

    //tính giờ và phút trong khoảng thời gian
    function GetHour(FromHour, ToHour) {
        var startTime = moment(FromHour, "HH:mm:ss");
        var endTime = moment(ToHour, "HH:mm:ss");
        var duration = moment.duration(endTime.diff(startTime));
        var hours = parseInt(duration.asHours()); //lấy tổng số giờ
        var minutes = parseInt(duration.asMinutes()) - hours * 60; // lấy số phút
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