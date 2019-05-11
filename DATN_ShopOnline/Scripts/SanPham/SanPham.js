var app = angular.module('myApp', ['angularUtils.directives.dirPagination', 'toastr']);//khởi tạo ungularjs cùng với thư viện dirPagination và toastr

app.controller('myCtrl', function ($scope, $http, toastr, $rootScope) {
    $scope.TableActive = "active";
    $scope.ActiveSP = "active";
    $scope.TableOpen = "menu-open";
    $scope.Titile = "";
    $scope.Select = false;
    $scope.Data = {};
    $scope.isShowAvatar = true;

    //Khởi tạo các hàm khi bắt đầu chạy giao diện
    $scope.init = function () {
        //các hàm dùng chung cho các giao diện
        $scope.Login();
        $scope.Seigneur();
        $scope.LoadLoaiSP();
        $scope.LoadNCC();
        $scope.ComBoSanPham();
        //khởi tạo các hàm chạy riêng của giao diện
        $scope.LoadSanPham();

    }
    //Lấy quyền hiển thị giao diện từ bảng nhân viên
    $scope.Seigneur = function () {
        $http({
            url: "/HomeAdmin/XemQuyen",
            method: 'GET'
        }).then(function mySuccess(res) {
            if (res.data.result[0].MaChucVu == 1) {
                $scope.ShowLSP = true;
                $scope.ShowNCC = true;
                $scope.ShowSP = true;
                $scope.ShowDH = true;
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
                $scope.TenNV = res.data.result[0].TenNV;
                $scope.HinhAnh = res.data.result[0].HinhAnh;
            }

        }, function myError(res) {
        });
    }

    //load toàn bộ sản phẩm lên giao diện
    $scope.LoadSanPham = function () {

        $http({
            url: "/SanPham/LoadSanPham",
            method: 'POST'
        }).then(function mySuccess(res) {
            $scope.ListSanPham = res.data.result;
            $scope.ListMTSP = res.data.resultMTSP;

        }, function myError(res) {
        });
    }

    //load toàn bộ loại sản phẩm lên combo
    $scope.LoadLoaiSP = function () {
        $http({
            url: "/SanPham/LoadLoaiSP/",
            method: 'POST'
        }).then(function mySuccess(res) {
            $scope.ListLoaiSP = res.data.result;

        }, function myError(res) {
        });
    }

    //load toàn bộ nhà cung cấp  lên combo
    $scope.LoadNCC = function () {
        $http({
            url: "/SanPham/LoadNCC/",
            method: 'POST'
        }).then(function mySuccess(res) {
            $scope.ListNCC = res.data.result;
        }, function myError(res) {
        });
    }

    //Map Path ảnh vào thư mục
    $scope.setFile = function (element) {
        $scope.$apply(function ($scope) {
            $scope.theFile = element.files[0];
            if ($scope.theFile == null || $scope.theFile == "") {
                toastr.error('Bạn chưa chọn file ảnh nào !!!', 'Error');
                $scope.isShowIMG = false;
            }
            else {
                var modal = new FormData();
                modal.append('IMG', $scope.theFile);
                var request = {
                    method: 'POST',
                    url: "/HomeAdmin/MapIMG",
                    data: modal,
                    headers: {
                        'Content-Type': undefined
                    }
                }
                $http(request)
                  .then(function mySuccess(res) {
                      //toastr.success('Successful ADD !!!', 'Success');
                  }, function myError(res) {
                  });

            }

        });
    };

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

    $("#avatar-2").change(function () {
        readURL(this);
    })
    //thêm sản phẩm
    $scope.btnADD = function () {
        $scope.Data = {};
        $scope.Titile = "Thêm sản phẩm";
        $scope.IconButton = "fa fa-save";
        $scope.ButtonTitle = "Thêm mới";
        $scope.isShowGiaNhap = true;
        $scope.isShowNeworOld = false;
        $scope.isShowKhungAnh = false;
        $scope.isShowAvatar = true;

        if ($scope.MaSP != null) {
            $scope.MaSP = null;
        }
        if ($scope.Data != null) {
            $scope.Data = {};
        }
        ShowPopup($, "#ShowPopup", 1000, 600);

        $scope.Data.KhungAnh = "";
        $scope.Data.KhungAnh = "top-10-khung-hinh-trang-dep-nhat-1.jpg";
    };
    //đóng modal
    $scope.ClosePopup = function () {
        $scope.Data = {};
        $scope.MaSP = null;
        //$scope.Data.KhungAnh = "/img/top-10-khung-hinh-trang-dep-nhat-1.jpg";
        $scope.theFile = null;
        $.colorbox.close();
    }

    //Sửa sản phẩm
    $scope.btnEdit = function (id) {
        $scope.Titile = "Sửa sản phẩm";
        $scope.IconButton = "fa fa-edit";
        $scope.ButtonTitle = "Cập nhập";
        $scope.isShowGiaNhap = false;
        $scope.isShowNeworOld = true;
        $scope.MaSP = id;
        var id = id;

        $scope.Data.KhungAnh = "";

        $scope.Data.KhungAnh = "top-10-khung-hinh-trang-dep-nhat-1.jpg";

        debugger

        $http({
            url: "/SanPham/GetEdit/" + id,
            method: 'POST'
        }).then(function mySuccess(res) {
            debugger
            $scope.GetEdit = res.data.result[0];
            $scope.Data.TenSP = res.data.result[0].TenSP;
            $scope.Data.MaNCC = res.data.result[0].MaNCC;
            $scope.Data.GiaBan = res.data.result[0].GiaBan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $scope.Data.MaLoai = res.data.result[0].MaLoai;
            $scope.Data.HeSo = res.data.result[0].HeSo.toString();
            //$scope.Data.KhungAnh = res.data.result[0].HinhAnh;
            $scope.Data.NeworOld = res.data.result[0].NeworOld;
            //$scope.isShowKhungAnh = true;
            if (res.data.result[0].HinhAnh!=null) {
                $('.clickable img').attr('src', '/img/' + res.data.result[0].HinhAnh);
            }
            else {
                $('.clickable img').attr('src', '/img/top-10-khung-hinh-trang-dep-nhat-1.jpg');

            }
            $scope.Data.HinhAnh = res.data.result[0].HinhAnh;
            $scope.isShowAvatar = true;
            ShowPopup($, "#ShowPopup", 1000, 700)


        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });

    };

    //Định dạng giá tiền khi nhập số
    $scope.ChangGiaBan = function () {
        var x = $scope.Data.GiaNhap;
        var x1 = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var x2 = x1.split(",");
        var list = x2.join("");
        $scope.Data.GiaNhap = list.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //Update or insert sản phẩm
    $scope.Send = function () {
        debugger
        if ($scope.Data.GiaNhap!=null) {
            var position = $scope.Data.GiaNhap.indexOf(',');
            if (position != -1) {
                var list = $scope.Data.GiaNhap.split(",");
                $scope.Data.GiaNhap = list.join("");
            }
        }
        

        if ($scope.theFile != null) {
            //modal.append('HinhAnh', $scope.theFile);
            $scope.Data.HinhAnh = $scope.theFile.name;
        }
        //else if ($scope.Data.KhungAnh != "top-10-khung-hinh-trang-dep-nhat-1.jpg") {
        //    $scope.Data.HinhAnh = $scope.Data.KhungAnh;
        //}
        //else {
        //    $scope.Data.HinhAnh = "";
        //}
        if ($scope.MaSP != null) {
            $scope.Data.MaSP = $scope.MaSP;
        }
        var request = {
            method: 'POST',
            url: "/SanPham/ADDSanPham",
            data: $scope.Data,
            //headers: {
            //    'Content-Type': undefined
            //}
        }
        $http(request)
          .then(function mySuccess(res) {
              debugger
              if (res.data.messenger.IsSuccess == true) {
                  toastr.success(res.data.messenger.Message, 'Success');
                  $scope.theFile = null;
                  $scope.LoadSanPham();
                  $scope.ClosePopup();
              }
              else {
                  if (res.data.messenger.RedirectToAction != null && res.data.messenger.RedirectToAction == true) {
                      window.location.href = "/Page404/Index";
                  }
                  else {
                      toastr.error(res.data.messenger.Message, 'Error');
                  }

              }
          }, function myError(res) {
              //$scope.load();
          });
    }

    //Xóa sản phẩm
    $scope.btnDelete = function (id) {
        var id = id;
        swal({
            title: "Bạn có chắc không?",
            text: "Bạn có chắc chắn muốn xóa sản phẩm này",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "OK",
            //closeOnConfirm: false
        },
        function () {
            $http({
                url: "/SanPham/Delete/" + id,
                method: 'POST'
            }).then(function mySuccess(res) {
                if (res.data.messenger.IsSuccess = true) {
                    toastr.success(res.data.messenger.Message, 'Success');
                    $scope.LoadSanPham();
                }
                else {
                    if (res.data.messenger.RedirectToAction != null && res.data.messenger.RedirectToAction == true) {
                        window.location.href = "/Page404/Index";
                    }
                    else {
                        toastr.error(res.data.messenger.Message, 'Error');
                        $scope.LoadSanPham();
                    }

                }
            }, function myError(response) {
                toastr.error("Lỗi rồi....!", 'Error');

            });
        });

    }

    //Load sản phẩm theo loại sản phẩm
    $scope.ChangListSP = function () {
        debugger
        var id = $scope.MaLoai;
        if (id == "" || id == null) {
            id = 0;
        }
        else {
            id = $scope.MaLoai;
        }
        $http({
            url: "/SanPham/ComboLoaiSP/" + id,
            method: 'POST'
        }).then(function mySuccess(res) {
            $scope.ComboSanPham = res.data.result;
        }, function myError(response) {
            toastr.error("Lỗi rồi....!", 'Error');

        });
    }

    //Load tất cả sản phẩm lên combobox
    $scope.ComBoSanPham = function () {
        $http({
            url: "/SanPham/LoadSanPham/",
            method: 'POST'
        }).then(function mySuccess(res) {
            $scope.ComboSanPham = res.data.result;
        }, function myError(res) {
        });
    }

    //Load tất cả sản phẩm theo tên sản phẩm
    $scope.ChangListSanPham = function () {
        var MaSP = 0
        if ($scope.MaSP != "" || $scope.MaSP != null) {
            MaSP = $scope.MaSP;
        }
        var request = {
            method: 'POST',
            url: "/SanPham/ComboSanPham",
            data: MaSP,
            //headers: {
            //    'Content-Type': undefined
            //}
        }
        $http(request)
          .then(function mySuccess(res) {
              if (res.data.messenger.IsSuccess = true) {
                  $scope.ComboSanPham = res.data.result;
                  console.log($scope.ComboSanPham)
              }
              else {
                  toastr.error(res.data.messenger.Message, 'Error');
              }
          }, function myError(res) {
              //$scope.load();
          });
    }

    //Tìm kiếm sản phẩm
    $scope.btnTimKiem = function () {
        var MaLoai;
        var MaSP;
        debugger
        if ($scope.MaLoai == null || $scope.MaLoai == "") {
            MaLoai = 0;
        }
        else {
            MaLoai = $scope.MaLoai;

        }
        if ($scope.MaSP == null || $scope.MaSP == "") {
            MaSP = 0;
        }
        else {
            MaSP = $scope.MaSP;

        }
        var request = {
            method: 'POST',
            url: "/SanPham/TimKiemSP",
            data: {
                MaLoai, MaSP
                },
                }
        $http(request)
          .then(function mySuccess(res) {
              $scope.ListSanPham = res.data.result;
                }, function myError(res) { 
          });

    }

    //Click button show modal mo tả sản phẩm
    $scope.btnAddMTSP = function (id) {
        $scope.Titile = "Thêm mô tả sản phẩm";
        $scope.IconButton = "fa fa-save";
        $scope.ButtonTitle = "Lưu lại";
        var id = id;
        $scope.MaSP = id;
        $http({
            url: "/SanPham/GetEdit/" + id,
            method: 'POST'
        }).then(function mySuccess(res) {
            debugger
            $scope.GetSP = res.data.result[0];
            $scope.HinhAnh1 = $scope.GetSP.HinhAnh;
            $scope.TenSP = $scope.GetSP.TenSP;

        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });

        CKEDITOR.replace('NoiDung');
        $(document).ready(function () {

            $.fn.modal.Constructor.prototype.enforceFocus = function () {
                modal_this = this
                $(document).on('#ShowPopupMTSP', function (e) {
                    if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
                        // add whatever conditions you need here:
                    &&
                    !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                        modal_this.$element.focus()
                    }
                })
            };

        });
        ShowPopup($, "#ShowPopupMTSP", 1000, 800);


    }

    //Add mô tả sản phẩm
    $scope.SendMTSP = function () {
        $scope.Data.MaSP = $scope.MaSP;
        $scope.Data.GioiThieu2 = CKEDITOR.instances["NoiDung"].getData();
        var request = {
            method: 'POST',
            url: "/SanPham/ADDMTSP",
            data: $scope.Data,
            //headers: {
            //    'Content-Type': undefined
            //}
        }
        $http(request)
          .then(function mySuccess(res) {
              debugger
              if (res.data.messenger.IsSuccess == true) {
                  toastr.success(res.data.messenger.Message, 'Success');
                  $scope.LoadSanPham();
                  $scope.ClosePopupMTSP();
              }
              else {
                  toastr.error(res.data.messenger.Message, 'Error');

              }
          }, function myError(res) {
              //$scope.load();
          });
    }

    //đóng modal mô tả sản phẩm
    $scope.ClosePopupMTSP = function () {
        $scope.Data = {};
        window.location.reload();
        $.colorbox.close();
    }

    $scope.btnXuatFile = function () {
        var MaLoai;
        var MaSP;
        if ($scope.MaLoai == null || $scope.MaLoai == "") {
            MaLoai = 0;
        }
        else {
            MaLoai = $scope.MaLoai;

        }
        if ($scope.MaSP == null || $scope.MaSP == "") {
            MaSP = 0;
        }
        else {
            MaSP = $scope.MaSP;

        }
        window.location = "/SanPham/XuatFile?MaLoai=" + MaLoai + "&MaSP=" + MaSP;

    }

    $scope.btnDocFile = function () {
        var modal = new FormData();
        if ($scope.theFile!=null) {
            modal.append('file', $scope.theFile);
            var request = {
                method: 'POST',
                url: "/SanPham/Upload",
                data: modal,
                headers: {
                    'Content-Type': undefined
                }
            }
            $http(request)
              .then(function mySuccess(res) {
              debugger
                  if (res.data.messenger.IsSuccess == true) {
                      toastr.success(res.data.messenger.Message, 'Success');
                      $scope.LoadSanPham();
                  }
                  else {
                      if (res.data.messenger.RedirectToAction != null && res.data.messenger.RedirectToAction == true) {
                          window.location.href = "/Page404/Index";
                      }
                      else {
                          toastr.error(res.data.messenger.Message, 'Error');
                      }
                  }
                
              }, function myError(res) {
                
              });
        }
        else {
            toastr.error("Bạn chưa nhập file nào!!!", 'Error');
        }
       
    }
    $scope.setFile1 = function (element) {
        $scope.$apply(function ($scope) {
            $scope.theFile = element.files[0];
        });
    };
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