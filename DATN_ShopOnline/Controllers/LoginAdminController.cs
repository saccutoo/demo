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
namespace DATN_ShopOnline.Controllers
{
    public class LoginAdminController : Controller
    {
        // GET: LoginAdmin
        private ShopOnline db = new ShopOnline();
        public ActionResult Index()
        {
            if (Session["TaiKhoan1"] != null)
            {
                return RedirectToAction("Index", "HomeAdmin", new
                {
                    TaiKhoan1 = Session["TaiKhoan1"].ToString(),
                    MatKhau = Session["MatKhau"].ToString(),
                    //HinhAnh = Session["HinhAnh"].ToString(),
                    //MaNV = Session["MaNV"].ToString(),
                });
            }
            else
            {                
                return View();
            }
        }
        [HttpPost]
        public ActionResult Login(TaiKhoan data)
        {
            Messenger messenger = new Messenger();
            try
            {
                var result = db.TaiKhoans.Single(s => s.TaiKhoan1 == data.TaiKhoan1 && s.MatKhau == data.MatKhau && s.LoaiTK == 0);
                if (result!=null)
                {
                    Session["TaiKhoan1"] = result.TaiKhoan1;
                    Session["MatKhau"] = result.MatKhau;
                    messenger.IsSuccess = true;
                    messenger.Message = "Đăng nhập thành công";
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger
                    }));
                }
            }
            catch (Exception)
            {
                messenger.IsSuccess = false;
                messenger.Message = "Tài khoản mật khẩu không tồn tại";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger
                }));
            }
            
            return View();
        }
    }
}