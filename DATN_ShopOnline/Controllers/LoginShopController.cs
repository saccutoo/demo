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
    public class LoginShopController : Controller
    {
        // GET: LoginShop
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index()
        {
            if (Session["TaiKhoanShop"] != null)
            {
                return RedirectToAction("Index", "HomeShop", new
                {
                    TaiKhoan = Session["TaiKhoanShop"].ToString(),
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
        public ActionResult LoginURL(string URL)
        {
            Session["URL"] = URL.ToString();
            return RedirectToAction("Index","LoginShop");
        }

        [HttpPost]
        public ActionResult Login(TaiKhoan data)
        {
            Messenger messenger = new Messenger();
            try
            {
                var result = db.TaiKhoans.Single(s => s.TaiKhoan1 == data.TaiKhoan1 && s.MatKhau == data.MatKhau && s.LoaiTK==1);
                if (result != null)
                {
                    if (Session["URL"] != null)
                    {
                        HttpCookie StudentCookies = new HttpCookie("StudentCookies");
                        StudentCookies.Name = result.TaiKhoan1;
                        StudentCookies.Value = result.MatKhau;
                        StudentCookies.Expires = DateTime.Now.AddDays(15);
                        //Response.Cookies.Add(StudentCookies);
                        System.Web.HttpContext.Current.Response.Cookies.Add(StudentCookies);
                        //var value = Request.Cookies["StudentCookies"].Value;

                        Session["TaiKhoanShop"] = result.TaiKhoan1;
                        Session["MatKhau"] = result.MatKhau;
                        messenger.IsSuccess = true;
                        messenger.Message = Session["URL"].ToString();
                        Session["URL"] = null;
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger
                        }));
                    }
                    else
                    {
                        HttpCookie StudentCookies = new HttpCookie("StudentCookies");
                        StudentCookies.Name = result.TaiKhoan1;
                        StudentCookies.Value = result.MatKhau;
                        StudentCookies.Expires = DateTime.Now.AddDays(15);
                        System.Web.HttpContext.Current.Response.Cookies.Add(StudentCookies);
                        //var value = Request.Cookies["StudentCookies"].Value;
                        Session["TaiKhoanShop"] = result.TaiKhoan1;
                        Session["MatKhau"] = result.MatKhau;
                        messenger.IsSuccess = true;
                        messenger.Message = "";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger
                        }));
                    }
                   
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

        public ActionResult Logout(string URL)
        {
            Session["TaiKhoanShop"] = null;
            return Redirect(URL);

        }

        public ActionResult LoginPay(TaiKhoan data,string URL)
        {
            Messenger messenger = new Messenger();
            try
            {
                var result = db.TaiKhoans.Single(s => s.TaiKhoan1 == data.TaiKhoan1 && s.MatKhau == data.MatKhau && s.LoaiTK == 1);
                if (result != null)
                {
                    Session["TaiKhoanShop"] = result.TaiKhoan1;
                    Session["MatKhau"] = result.MatKhau;
                    messenger.IsSuccess = true;
                    messenger.Message = URL.ToString();
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