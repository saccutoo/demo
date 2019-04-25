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
    public class ShopListController : Controller
    {
        // GET: ShopList
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index(string ID,string search)
        {
            if (ID!=null)
            {
                ViewBag.ID = ID;

            }
            if (search!=null || search != "")
            {
                ViewBag.search = search;
            }
            return View();
        }       
        public ActionResult LoadSanPhamFormCheck(int []data)
        {
            if (data==null)
            {
                var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else
            {
                if (data.Length == 2)
                {
                    int x1 = data[0];
                    int x2 = data[1];
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 && s.MaLoai == x2).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else if (data.Length == 1)
                {
                    int x1 = data[0];
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
            }
            return View();         
        }
        public ActionResult TimKiem(int GiaTu,int GiaDen,int []data)
        {
            if (data == null)
            {
                
                if (GiaTu==0 && GiaDen==0)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else if (GiaTu != 0 && GiaDen == 0)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s=>s.GiaBan>= GiaTu).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else if (GiaTu == 0 && GiaDen != 0)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.GiaBan <= GiaDen).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
                else if (GiaTu != 0 && GiaDen != 0)
                {
                    var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.GiaBan >=GiaTu && s.GiaBan<=GiaDen).ToList();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result,
                    }));
                }
            }
            else
            {
               
                if (data.Length == 1)
                {
                    int x1 = data[0];
                    if (GiaTu == 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1).Where(s => s.GiaBan >= GiaTu).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu == 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1).Where(s => s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1).Where(s => s.GiaBan >= GiaTu && s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                }
                else if (data.Length == 2)
                {
                    int x1 = data[0];
                    int x2 = data[1];
                    if (GiaTu == 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai==x2).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2).Where(s => s.GiaBan >= GiaTu).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu == 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2).Where(s => s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2).Where(s => s.GiaBan >= GiaTu && s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                }
                else if (data.Length == 3)
                {
                    int x1 = data[0];
                    int x2 = data[1];
                    int x3 = data[2];
                    if (GiaTu == 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3).Where(s => s.GiaBan >= GiaTu).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu == 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3).Where(s => s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3).Where(s => s.GiaBan >= GiaTu && s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                }
                else if (data.Length == 4)
                {
                    int x1 = data[0];
                    int x2 = data[1];
                    int x3 = data[2];
                    int x4 = data[3];

                    if (GiaTu == 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3 || s.MaLoai == x4).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen == 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3 || s.MaLoai == x4).Where(s => s.GiaBan >= GiaTu).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu == 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3 || s.MaLoai == x4).Where(s => s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                    else if (GiaTu != 0 && GiaDen != 0)
                    {
                        var result = db.SanPhams.Include(s => s.LOAISP).Include(s => s.NHACC).Include(s => s.MOTASANPHAM).Where(s => s.MaLoai == x1 || s.MaLoai == x2 || s.MaLoai == x3 || s.MaLoai == x4).Where(s => s.GiaBan >= GiaTu && s.GiaBan <= GiaDen).ToList();
                        return Content(JsonConvert.SerializeObject(new
                        {
                            result,
                        }));
                    }
                }
            }
            return View();
        }

        public ActionResult Search(string search)
        {
            int searchnumber;
            try
            {
                searchnumber = int.Parse(search);
                var result = db.SanPhams.Where(s=>s.GiaBan >= searchnumber || s.TenSP.Contains(search)).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            catch (Exception)
            {
                var result = db.SanPhams.Where(s => s.TenSP.Contains(search) || s.NeworOld.Contains(search) ).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
        }
    }
}