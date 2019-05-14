using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using DATN_ShopOnline.Entity;
using System.Data;
using System.Data.Entity;
using System.Threading.Tasks;
using System.IO;
using System.Web.Hosting;
using DATN_ShopOnline.Class;
using ClosedXML.Excel;
using OfficeOpenXml;
using static DATN_ShopOnline.Class.Constant;


namespace DATN_ShopOnline.Controllers
{
    public class HomeAdminController : BaseAdminController
    {
        // GET: HomeAdmin
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();

        public ActionResult Index()
        {

            if (Session["TaiKhoan1"] != null)
            {
                bool Check = Permission("HomeAdmin", "Index");
                if (Check == true)
                {
                    return View();
                }
                else
                {
                    var TK = Session["TaiKhoan1"].ToString();
                    var m = db.NhanViens.Single(s => s.TaiKhoan == TK);
                    return RedirectToAction("Index", "Page404",m);
                }
            }
            else
            {
                return RedirectToAction("Index","LoginAdmin");
            }
        }
        public ActionResult Login()
        {
            Messenger messenger = new Messenger();
            if (Session["TaiKhoan1"] != null)
            {
                var TK = Session["TaiKhoan1"].ToString();
                var result = db.NhanViens.Select(s => new
                {
                    MaNV = s.MaNV,
                    MaChucVu = s.MaChucVu,
                    TaiKhoan = s.TaiKhoan,
                    TenNV=s.TenNV,
                    HinhAnh=s.AnhDaiDien,
                    ChucVu = new
                    {
                        MaChucVu = s.CHUCVU,
                    },

                }).Where(s => s.TaiKhoan.Contains(TK));
                messenger.IsSuccess = true;
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                    messenger
                }));
            }
            else
            {
                messenger.IsSuccess = false;
                messenger.Message = "Bạn chưa đăng nhập tài khoản";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger
                }));
            }
        }
        public ActionResult XemQuyen()
        {
            if (Session["TaiKhoan1"] != null)
            {
                var TK = Session["TaiKhoan1"].ToString();
                var result = db.NhanViens.Select(s => new
                {
                    MaNV = s.MaNV,
                    MaChucVu = s.MaChucVu,
                    TaiKhoan=s.TaiKhoan,
                    ChucVu = new
                    {
                        MaChucVu = s.CHUCVU,
                    },

                }).Where(s => s.TaiKhoan.Contains(TK));
              
                return Content(JsonConvert.SerializeObject(new
                {
                    result
                }));
            }
            return View(); 
        }
        [HttpPost]
        public ActionResult MapIMG(HttpPostedFileBase IMG)
        {
            var filename = "";
            if (IMG != null)
            {
                filename = Path.GetFileName(IMG.FileName);

                //Lưu đường dẫm của fileName
                var duongDan = Path.Combine(HostingEnvironment.MapPath("~/img"), filename);

                //kiểm tra tồn tại của hình ảnh
                if (System.IO.File.Exists(duongDan))
                {
                    ViewBag.ThongBao = "Hình ảnh đã tồn tại";
                }
                else
                {
                    IMG.SaveAs(duongDan);
                }
               
            }
            return Content(JsonConvert.SerializeObject(new
            {
                filename
            }));
        }

        //public DataTable Import(string path)
        //{
        //    using (var pck = new ExcelPackage())
        //    {
        //        using (var stream = File.OpenRead(path))
        //        {
        //            pck.Load(stream);
        //        }
        //        var ws = pck.Workbook.Worksheets[0];
        //        var tbl = new DataTable();
        //        var cells = ws.Cells[1, 1, 1, ws.Dimension.End.Column];
        //        for (var i = cells.Start.Column; i <= cells.End.Column; i++)
        //        {
        //            tbl.Columns.Add(cells[1, i].Value.ToString());
        //        }
        //        for (var rowNum = 2; rowNum <= ws.Dimension.End.Row; rowNum++)
        //        {
        //            var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
        //            var row = tbl.NewRow();
        //            for (var cellIndex = 1; cellIndex <= ws.Dimension.End.Column; cellIndex++)
        //            {
        //                row[cellIndex - 1] = wsRow[rowNum, cellIndex].Value;
        //            }
        //            tbl.Rows.Add(row);
        //        }
        //        return tbl;
        //    }
        //}
        public ActionResult Upload(HttpPostedFileBase file)
        {
            if (Request != null)
            {
                 file = Request.Files["file"];
                if ((file != null) && (file.ContentLength > 0) && !string.IsNullOrEmpty(file.FileName))
                {
                    string fileName = file.FileName;
                    string fileContentType = file.ContentType;
                    byte[] fileBytes = new byte[file.ContentLength];
                    var data = file.InputStream.Read(fileBytes, 0, Convert.ToInt32(file.ContentLength));
                    //var SPList = new List<SanPham>();

                    using (var package = new ExcelPackage(file.InputStream))
                    {
                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet.First();
                        var noOfCol = workSheet.Dimension.End.Column;
                        var noOfRow = workSheet.Dimension.End.Row;

                        for (int rowIterator = 2; rowIterator <= noOfRow; rowIterator++)
                        {
                            var SP = new SanPham();
                            SP.TenSP = workSheet.Cells[rowIterator, 1].Value == null ? null : workSheet.Cells[rowIterator, 1].Value.ToString();
                            //SP.GiaBan = workSheet.Cells[rowIterator, 2].Value == null ? (double?)null : Convert.ToDouble(workSheet.Cells[rowIterator, 2].Value.ToString());

                            db.SanPhams.Add(SP);
                            db.SaveChanges();

                        }
                    }
                    messenger.IsSuccess = true;
                    messenger.Message = "Thêm sản phẩm thành công!!!";

                    return Content(JsonConvert.SerializeObject(new
                    {
                        result = messenger
                    }));
                }
            }
            messenger.IsSuccess = false;
            messenger.Message = "Thất bại";

            return Content(JsonConvert.SerializeObject(new
            {
                result = messenger
            }));
        }
        public ActionResult LoadMenu()
        {
            if (Session["TaiKhoan1"] != null)
            {          
               try
                {
                    var TK = Session["TaiKhoan1"].ToString();
                    NhanVien nv = db.NhanViens.Single(s => s.TaiKhoan == TK);
                    var result = db.Grids.Where(s => s.MaChucVu == nv.MaChucVu);
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result
                    }));
                }
                catch (Exception)
                {
                    var TK = Session["TaiKhoan1"].ToString();
                    var m = db.NhanViens.Single(s => s.TaiKhoan == TK);
                    return RedirectToAction("Index", "Page404", m);
                }
               
            }
            else
            {
                return RedirectToAction("Index", "LoginAdmin");
            }

        }


    }
}