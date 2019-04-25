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
    public class Page404Controller : Controller
    {
        // GET: Page404
        private ShopOnline db = new ShopOnline();
        public ActionResult Index(NhanVien m)
        {
            if (m!=null)
            {
                return View(m);
            }
            else
            {
                var TK = Session["TaiKhoan1"].ToString();
                m = db.NhanViens.Single(s => s.TaiKhoan == TK);
                return View(m);
            }
        }
    }
}