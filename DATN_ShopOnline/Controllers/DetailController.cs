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
    public class DetailController : Controller
    {
        // GET: Detail
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index(int ID)
        {
            ViewBag.ID = ID;
            return View();
        }
        public ActionResult GetDetail(int ID)
        {
            var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Include(s => s.BINHLUAN).Where(s => s.MaSP == ID).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult AddComment(BinhLuan Data)
        {
            Data.NgayBinhLuan = DateTime.Now;
            Data.TrangThai = 1;
            try
            {
                db.BinhLuans.Add(Data);
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Cảm ơn bạn đã nhận xét sản phẩm.Nhận xét của bạn sẽ được phê duyệt sớm nhất có thể.Thank you!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {
                messenger.IsSuccess = false;
                messenger.Message = "Nhận xét không thành công.Mời bạn nhận xét lại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
        }
        public ActionResult LoadSanPhamTuongTu(int SL, int Status,int MaSP)
        {
            if (Status == 1)
            {
                SanPham sp = db.SanPhams.Find(MaSP);
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai).Where(s => s.MaSP != MaSP).Take(SL).ToList();
                if (result.Count< SL)
                {
                    result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai).Where(s => s.MaSP != MaSP).Take(SL + 1).ToList();
                }
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
                    SanPham sp = db.SanPhams.Find(MaSP);
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai).Where(s => s.MaSP != MaSP).Take(4).ToList();
                    if (result.Count<SL)
                    {
                        result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai).Where(s => s.MaSP != MaSP).Take(5).ToList();
                    }
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else
                {
                    SanPham sp = db.SanPhams.Find(MaSP);
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai).Where(s => s.MaSP != MaSP).Take(SL).ToList();
                    if (result.Count < SL)
                    {
                        result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai).Where(s => s.MaSP != MaSP).Take(SL + 1).ToList();
                    }
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
            }
            else
            {
                SanPham sp = db.SanPhams.Find(MaSP);
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai ).Where(s=>s.MaSP!=MaSP).Take(4).ToList();
                if (result.Count<4)
                {
                    result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == sp.MaLoai).Where(s => s.MaSP != MaSP).Take(5).ToList();

                }
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }

        }

        public ActionResult DetailRepComment(RepBinhLuan data)
        {
            data.NgayBinhLuan = DateTime.Now;
            try
            {
                db.RepBinhLuans.Add(data);
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Cảm ơn bạn đã nhận xét sản phẩm.Nhận xét của bạn sẽ được phê duyệt sớm nhất có thể.Thank you!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            catch (Exception)
            {
                messenger.IsSuccess = false;
                messenger.Message = "Nhận xét không thành công.Mời bạn nhận xét lại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
        }

    }
}