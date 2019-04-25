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
using System.Net.Mail;
using System.Net;
using System.Globalization;
using System.Net.Mime;
using ClosedXML.Excel;


namespace DATN_ShopOnline.Controllers
{
    public class MyAccountController : Controller
    {
        // GET: Account
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index()
        {
            if (Session["TaiKhoanShop"] != null)
            {                
                return View();
            }
            else
            {
                return RedirectToAction("Index", "HomeShop");
            }
        }
        public ActionResult GetListOrder(int ID)
        {
            var result = db.DonBans.Where(s => s.MaKH == ID).OrderByDescending(s=>s.MaDB).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult GetListOrderDetail(int ID)
        {
            var result = db.ChiTietDonBans.Where(s => s.MaDB == ID).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult LoadCity()
        {
            var result = db.ThanhPhos.ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult LoadDistrict(int? MaThanhPho)
        {
            if (MaThanhPho != null)
            {
                
                var result = db.Huyens.Where(s => s.MaThanhPho == MaThanhPho).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else
            {
                var result = db.Huyens.ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            
        }
        public ActionResult GetPay(int ID)
        {
            var result = db.KhachHangs.Where(s => s.MaKH == ID).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult SavePay(KhachHang data)
        {
            try
            {
                KhachHang kh = db.KhachHangs.Find(data.MaKH);
                kh.DiaChi = data.DiaChi;
                kh.MaHuyen = data.MaHuyen;
                kh.MaThanhPho = data.MaThanhPho;
                db.Entry(kh).State = EntityState.Modified;
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Cập nhập thành công";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {
                messenger.IsSuccess = false;
                messenger.Message = "Cập nhập thất bại";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
        }
        public ActionResult GetCustomer(int ID)
        {
            var result = db.KhachHangs.Where(s => s.MaKH == ID).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult SaveCustomer(KhachHang data)
        {
            try
            {
                KhachHang kh = db.KhachHangs.Find(data.MaKH);
                kh.GioiTinh = data.GioiTinh;
                kh.TenKH = data.TenKH;
                kh.SDT = data.SDT;
                kh.Gmail = data.Gmail;
                kh.NgaySinh = data.NgaySinh;
                db.Entry(kh).State = EntityState.Modified;
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Cập nhập thành công";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {
                messenger.IsSuccess = false;
                messenger.Message = "Cập nhập thất bại";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
        }

        public ActionResult RemoveDB(int MaDB)
        {
            try
            {
                double TongTien = 0;
                DonBan dh = db.DonBans.Find(MaDB);
                var ListCTDH = db.ChiTietDonBans.Where(s => s.MaDB == MaDB);
                foreach (var item in ListCTDH)
                {
                    ChiTietDonBan ctdh = db.ChiTietDonBans.Find(item.MaCTDB);
                    SanPham sp = db.SanPhams.Find(ctdh.MaSP);
                    ctdh.TrangThai = 4;
                    double ThanhTien = Convert.ToDouble(ctdh.SoLuong*sp.GiaBan);
                    TongTien += ThanhTien;
                    db.Entry(ctdh).State = EntityState.Modified;
                }
                dh.TrangThai = 4;
                dh.TongTien = TongTien;
                db.Entry(dh).State = EntityState.Modified;
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Đơn hàng đã được hủy";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {

                messenger.IsSuccess = false;
                messenger.Message = "Hủy đơn thất bại";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

        }

        public ActionResult RemoveCTDB(int MaCTDB,int MaDB)
        {
            try
            {
                double TongTien = 0;
                ChiTietDonBan ctdb = db.ChiTietDonBans.Find(MaCTDB);
                DonBan dh = db.DonBans.Find(MaDB);
                ctdb.TrangThai = 4;
                db.Entry(ctdb).State = EntityState.Modified;
                db.SaveChanges();

                var ListCTDB = db.ChiTietDonBans.Where(s=>s.MaDB==MaDB).Where(s=>s.TrangThai!=4).ToList();
                if (ListCTDB.Count()==0)
                {
                    ListCTDB= db.ChiTietDonBans.Where(s => s.MaDB == MaDB).Where(s => s.TrangThai == 4).ToList();
                    foreach (var item in ListCTDB)
                    {
                        SanPham sp = db.SanPhams.Find(item.MaSP);
                        double ThanhTien = Convert.ToDouble(item.SoLuong * sp.GiaBan);
                        TongTien += ThanhTien;
                    }
                    dh.TongTien = dh.PhiShip + TongTien;
                    dh.TrangThai = 4;
                    db.Entry(dh).State = EntityState.Modified;
                    db.SaveChanges();
                }
                else
                {
                    foreach (var item in ListCTDB)
                    {
                        SanPham sp = db.SanPhams.Find(item.MaSP);
                        double ThanhTien = Convert.ToDouble(item.SoLuong * sp.GiaBan);
                        TongTien += ThanhTien;
                    }
                    dh.TongTien = dh.PhiShip + TongTien;
                    db.Entry(dh).State = EntityState.Modified;
                    db.SaveChanges();
                }
                

               
                messenger.IsSuccess = true;
                messenger.Message = "Sản phẩm này đã hủy";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {

                messenger.IsSuccess = false;
                messenger.Message = "Hủy sản phẩm thất bại";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

        }

        //xuất excel
        public ActionResult ExportExcel()
        {
            DataTable dt = new DataTable("Grid");
            dt.Columns.AddRange(new DataColumn[1]
            {
                new DataColumn("Tên khách hàng"),
               
            });
            dt.Columns[0].DataType = typeof(string);


            var lstKH = db.KhachHangs.ToList();
            foreach (var item in lstKH)
            {
                dt.Rows.Add(item.TenKH);
            }

            var wb = new XLWorkbook();
            wb.Worksheets.Add(dt);
            byte[] data = null;
            using (var stream = new MemoryStream())
            {
                wb.SaveAs(stream);
                data = stream.ToArray();
            }
            return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "PersonalIncomeTax.xlsx");
        }

    }
}