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
    public class DonHangController : Controller
    {
        // GET: DonHang
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index()
        {
            if (Session["TaiKhoan1"] != null)
            {
                bool Check = Permission("DonHang", "Index");
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
        public ActionResult LoadDonHang()
        {
            var result = db.DonBans.Include(s => s.KHACHHANG).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));

        }
        public ActionResult Timkiem(int TrangThai)
        {
            var result = db.DonBans.Include(s => s.KHACHHANG).Where(s=>s.TrangThai==TrangThai).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));

        }

        public ActionResult Delete(int MaDH)
        {
            try
            {
                DonBan dh = db.DonBans.Find(MaDH);
                db.DonBans.Remove(dh);
                db.SaveChanges();

                var ctdh = db.ChiTietDonBans.Where(s => s.MaDB == MaDH).ToList();
                if (ctdh!=null)
                {
                    foreach (var item in ctdh)
                    {
                        ChiTietDonBan ctdb = db.ChiTietDonBans.Find(item.MaCTDB);
                        db.ChiTietDonBans.Remove(ctdb);
                        db.SaveChanges();
                    }
                }
                
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