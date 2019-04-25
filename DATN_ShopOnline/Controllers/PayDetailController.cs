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


namespace DATN_ShopOnline.Controllers
{
    public class PayDetailController : Controller
    {
        // GET: PayDetail
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index()
        {
            if (Session["MaDB"] != null)
            {
                ViewBag.MaDB = Session["MaDB"];
                Session["MaDB"] = null;
                return View();
            }
            else
            {
                return RedirectToAction("Index", "HomeShop");
            }

        }
        public ActionResult PayDetail(int ID)
        {
            var result = db.DonBans.Include(s => s.KHACHHANG).Where(s => s.MaDB == ID).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
    }
}