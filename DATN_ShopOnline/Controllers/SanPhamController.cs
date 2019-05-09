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

namespace DATN_ShopOnline.Controllers
{
    public class SanPhamController : Controller
    {
        // GET: SanPham
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index()
        {
            if (Session["TaiKhoan1"] != null)
            {
                bool Check = Permission("SanPham", "Index");
                if (Check == true)
                {
                    return View();
                }
                else
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
        public ActionResult LoadSanPham()
        {
            var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).ToList();
            var resultMTSP = db.MoTaSanPhams.ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
                resultMTSP,
            }));

        }
        public ActionResult LoadLoaiSP()
        {
            var result = db.LoaiSanPhams.ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult LoadNCC()
        {
            var result = db.NhaCungCaps.ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult ADDSanPham(SanPham data)
        {
            //filename = Path.GetFileName(IMG.FileName);
            //db.Entry(sANPHAM).State = EntityState.Modified;
            if (data != null)
            {
                if (data.MaSP == 0 || data.MaSP == null)
                {
                    bool Check = Permission("SanPham", "Add");
                    if (Check == true)
                    {
                        data.SoLuong = 0;
                        double hesotang = (100 + Convert.ToDouble(data.HeSo)) / 100;
                        double GiaBan = hesotang * Convert.ToDouble(data.GiaNhap);
                        data.GiaBan = Convert.ToInt64(GiaBan);
                        data.SoLuongDaBan = 0;
                        data.NeworOld = "img_icone";
                        data.ImgNeworOld = "span-new.png";
                        data.TrangThai = false;
                        db.SanPhams.Add(data);
                        db.SaveChanges();
                        messenger.IsSuccess = true;
                        messenger.Message = "Thêm sản phẩm thành công!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger,
                        }));
                    }
                    else
                    {
                        messenger.IsSuccess = false;
                        messenger.RedirectToAction = true;
                        messenger.Message = "Thêm sản phẩm thất bại!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger,
                        }));
                    }

                }
                else
                {
                    bool Check = Permission("SanPham", "Edit");
                    if (Check == true)
                    {
                        SanPham sp = db.SanPhams.Find(data.MaSP);
                        sp.MaSP = data.MaSP;
                        sp.MaNCC = data.MaNCC;
                        sp.MaLoai = data.MaLoai;
                        sp.TenSP = data.TenSP;
                        sp.HinhAnh = data.HinhAnh;
                        double hesotang = (100 + Convert.ToDouble(data.HeSo)) / 100;
                        double GiaBan = hesotang * Convert.ToDouble(sp.GiaNhap);
                        sp.GiaBan = Convert.ToInt64(GiaBan);
                        sp.HeSo = data.HeSo;
                        db.Entry(sp).State = EntityState.Modified;
                        db.SaveChanges();
                        messenger.IsSuccess = true;
                        messenger.Message = "Cập nhập thành công";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger,
                        }));
                    }
                    else
                    {
                        messenger.IsSuccess = false;
                        messenger.RedirectToAction = true;
                        messenger.Message = "Thêm sản phẩm thất bại!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger,
                        }));
                    }

                }

            }
            else
            {
                messenger.IsSuccess = false;
                messenger.Message = "Thêm sản phẩm thất bại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));

            }
        }
        public ActionResult GetEdit(int id)
        {
            var result = db.SanPhams.Where(s => s.MaSP == id).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult Delete(int id)
        {
            try
            {
                SanPham sp = db.SanPhams.Find(id);
                db.SanPhams.Remove(sp);
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Xóa sản phẩm thành công!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {
                messenger.IsSuccess = false;
                messenger.Message = "Xóa sản phẩm thất bại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

        }
        public ActionResult ComboLoaiSP(int id)
        {

            if (id == 0)
            {
                var result = db.SanPhams.ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else
            {
                var result = db.SanPhams.Where(s => s.MaLoai == id).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
        }
        public ActionResult ComboSanPham(int MaSP)
        {
            if (MaSP == 0)
            {
                var result = db.SanPhams.ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else
            {
                var result = db.SanPhams.Where(s => s.MaSP == MaSP).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
        }
        public ActionResult TimKiemSP(int MaLoai, int MaSP)
        {
            if (MaLoai == 0 && MaSP == 0)
            {
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else if (MaLoai != 0 && MaSP == 0)
            {
                var result = db.SanPhams.Where(s => s.MaLoai == MaLoai).Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else if (MaLoai == 0 && MaSP != 0)
            {
                var result = db.SanPhams.Where(s => s.MaSP == MaSP).Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));

            }
            else
            {
                var result = db.SanPhams.Where(s => s.MaSP == MaSP).Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
        }
        public ActionResult SaveSanPham()
        {
            return View();
        }
        public ActionResult Edit()
        {
            return View();
        }
        public ActionResult SaveMTSP(MoTaSanPham MTSP)
        {
            return View();
        }
        [ValidateInput(false)]
        public ActionResult ADDMTSP(MoTaSanPham MTSP)
        {
            try
            {
                db.MoTaSanPhams.Add(MTSP);
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Thêm mô tả thành công!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {
                messenger.IsSuccess = false;
                messenger.Message = "Thêm mô tả thành thất bại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

        }
        public ActionResult XuatFile(int MaLoai, int MaSP)
        {
            bool Check = Permission("SanPham", "ExportExcel");
            if (Check == true)
            {
                List<SanPham> result;
                DataTable dt = new DataTable("Grid");
                dt.Columns.AddRange(new DataColumn[8]
                {
                new DataColumn("Tên sản phẩm"),
                new DataColumn("Nhà cung cấp"),
                new DataColumn("Loại"),
                new DataColumn("Số lượng"),
                new DataColumn("Giá bán"),
                new DataColumn("Số lượng đã bán"),
                new DataColumn("Hệ số"),
                new DataColumn("Trạng thái")
                });
                dt.Columns[0].DataType = typeof(string);
                dt.Columns[1].DataType = typeof(string);
                dt.Columns[2].DataType = typeof(string);
                dt.Columns[3].DataType = typeof(int);
                dt.Columns[4].DataType = typeof(double);
                dt.Columns[5].DataType = typeof(int);
                dt.Columns[6].DataType = typeof(double);
                dt.Columns[7].DataType = typeof(bool);

                if (MaLoai == 0 && MaSP == 0)
                {
                    result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                }
                else if (MaLoai != 0 && MaSP == 0)
                {
                    result = db.SanPhams.Where(s => s.MaLoai == MaLoai).Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                }
                else if (MaLoai == 0 && MaSP != 0)
                {
                    result = db.SanPhams.Where(s => s.MaSP == MaSP).Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                }
                else
                {
                    result = db.SanPhams.Where(s => s.MaSP == MaSP).Include(s => s.LOAISP).Include(s => s.NHACC).ToList();
                }
                foreach (var item in result)
                {
                    dt.Rows.Add(item.TenSP, item.LOAISP.TenLoai, item.NHACC.TenNCC, item.SoLuong, item.GiaBan, item.SoLuongDaBan, item.HeSo, item.TrangThai);
                }

                var wb = new XLWorkbook();
                wb.Worksheets.Add(dt);
                byte[] data = null;
                using (var stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    data = stream.ToArray();
                }
                return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", " SanPham.xlsx");

            }
            else
            {
                var TK = Session["TaiKhoan1"].ToString();
                var m = db.NhanViens.Single(s => s.TaiKhoan == TK);
                return RedirectToAction("Index", "Page404", m);
            }

        }
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
                            SP.SoLuong= workSheet.Cells[rowIterator, 2].Value == null ? (int?)null : Convert.ToInt32(workSheet.Cells[rowIterator, 2].Value.ToString());
                            SP.GiaNhap = workSheet.Cells[rowIterator, 2].Value == null ? (double?)null : Convert.ToDouble(workSheet.Cells[rowIterator, 3].Value.ToString());
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
        public bool Permission(string Controller, string Action)
        {
            if (Session["TaiKhoan1"] != null)
            {
                var TaiKhoan = Session["TaiKhoan1"].ToString();
                var resultNV = db.NhanViens.Single(s => s.TaiKhoan.Contains(TaiKhoan));
                try
                {
                    var resultAction = db.Actions.Single(s => s.Controller == Controller && s.MaNV == resultNV.MaNV);
                    if (Action == "Index")
                    {
                        if (resultAction.isIndex == true) return true;
                        else return false;
                    }
                    else if (Action == "Get")
                    {
                        if (resultAction.isGet == true) return true;
                        else return false;
                    }
                    else if (Action == "Add")
                    {
                        if (resultAction.isAdd == true) return true;
                        else return false;
                    }
                    else if (Action == "Edit")
                    {
                        if (resultAction.isEdit == true) return true;
                        else return false;
                    }
                    if (Action == "Delete")
                    {
                        if (resultAction.isDelete == true) return true;
                        else return false;
                    }
                    else if (Action == "Submit")
                    {
                        if (resultAction.isSubmit == true) return true;
                        else return false;
                    }
                    else if (Action == "ExportExcel")
                    {
                        if (resultAction.isExportExcel == true) return true;
                        else return false;
                    }
                    else if (Action == "ImportExecel")
                    {
                        if (resultAction.isImportExcel == true) return true;
                        else return false;
                    }
                    else
                    {
                        return false;

                    }
                }
                catch (Exception)
                {

                    return false;
                }

            }
            else
            {
                return false;
            }
        }
       
    }
}