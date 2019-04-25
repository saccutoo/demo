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
    public class HomeShopController : Controller
    {
        // GET: HomeShop
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            Messenger messenger = new Messenger();

            if (Session["TaiKhoanShop"] != null)
            {
                var TK = Session["TaiKhoanShop"].ToString();
                var result = db.KhachHangs.Include(s=>s.THANHPHO).Include(s=>s.HUYEN).Where(s => s.TaiKhoan.Contains(TK));
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
        public ActionResult ModalDetail()
        {
            return View();
        }
        public ActionResult Banner()
        {
            return View();
        }
        public ActionResult Slider()
        {
            return View();
        }
        public ActionResult GetDetail(int ID)
        {
            var result = db.SanPhams.Include(s=>s.LOAISP).Include(s=>s.NHACC).Include(s=>s.MOTASANPHAM).Where(s => s.MaSP == ID).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult LoadVangY(int SL,int Status)
        {
            if (Status == 1)
            {
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Take(SL).Where(s=>s.MaLoai==2).ToList();
                if (SL>result.Count)
                {
                    messenger.IsSuccess = true;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }
                else
                {
                    messenger.IsSuccess = false;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }
                
            }
            else if(Status == 0)
            {
                if (SL == 4)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Take(4).Where(s => s.MaLoai == 2).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Take(SL).Where(s => s.MaLoai == 2).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
            }
            else
            {
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Take(4).Where(s => s.MaLoai == 2).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            
        }
        public ActionResult LoadVangTayBanNha(int SL, int Status)
        {
            if (Status == 1)
            {
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 3).Take(SL).ToList();
                if (SL > result.Count)
                {
                    messenger.IsSuccess = true;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }
                else
                {
                    messenger.IsSuccess = false;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }

            }
            else if (Status == 0)
            {
                if (SL == 4)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 3).Take(4).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 3).Take(SL).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
            }
            else
            {
                //var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Take(4).Where(s => s.MaLoai == 3).ToList();
                var result = db.SanPhams.Where(s=>s.MaLoai==3).Take(4).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }

        }
        public ActionResult LoadVangPhap(int SL, int Status)
        {
            if (Status == 1)
            {
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 5).Take(SL).ToList();
                if (SL > result.Count)
                {
                    messenger.IsSuccess = true;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }
                else
                {
                    messenger.IsSuccess = false;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }

            }
            else if (Status == 0)
            {
                if (SL == 4)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 5).Take(4).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 5).Take(SL).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
            }
            else
            {
                //var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Take(4).Where(s => s.MaLoai == 3).ToList();
                var result = db.SanPhams.Where(s => s.MaLoai == 5).Take(4).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }

        }
        public ActionResult LoadVangChile(int SL, int Status)
        {
            if (Status == 1)
            {
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 4).Take(SL).ToList();
                if (SL > result.Count)
                {
                    messenger.IsSuccess = true;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }
                else
                {
                    messenger.IsSuccess = false;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                        result,
                    }));
                }

            }
            else if (Status == 0)
            {
                if (SL == 4)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 4).Take(4).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == 4).Take(SL).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
            }
            else
            {
                //var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Take(4).Where(s => s.MaLoai == 3).ToList();
                var result = db.SanPhams.Where(s => s.MaLoai == 4).Take(4).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }

        }

        public ActionResult GetALLLoaiSP()
        {
            var result = db.LoaiSanPhams.ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }


    }
}