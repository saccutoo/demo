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
    public class ShopCartController : Controller
    {
        // GET: ShopCart
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ShopCart()
        {
            List<ShopCart> listShopCart = Session["ShopCart"] as List<ShopCart>;
            return Content(JsonConvert.SerializeObject(new
            {
                listShopCart,
            }));
        }
        public List<ShopCart> GetListCart()
        {
            List<ShopCart> ListShopCart = Session["ShopCart"] as List<ShopCart>;
            if (ListShopCart == null)
            {
                ListShopCart = new List<ShopCart>();
                Session["ShopCart"] = ListShopCart;
            }
            return ListShopCart;
        }
        public ActionResult ADDShopCart(int iMaSP,int iSoLuong)
        {
            SanPham SanPham = db.SanPhams.Find(iMaSP);
            if (SanPham == null)
            {
                messenger.IsSuccess = false;
                messenger.Message = "sản phẩm không tồn tại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

            if (SanPham.SoLuong >= 0 )
            {               
                List<ShopCart> ListShopCart = GetListCart();
                ShopCart ShopCart = ListShopCart.Find(n => n.iMaSP == iMaSP);
                if (ShopCart == null)
                {
                    ShopCart = new ShopCart(iMaSP);
                    ShopCart.iSoLuongBan = iSoLuong;
                    ShopCart.ThanhTien = ShopCart.iSoLuongBan * ShopCart.iGiaBan;
                    ListShopCart.Add(ShopCart);
                    List<ShopCart> listShopCart = Session["ShopCart"] as List<ShopCart>;
                    messenger.IsSuccess = true;
                    messenger.Message = "Thêm sản phẩm vào giỏ thành công!!!";
                    return Content(JsonConvert.SerializeObject(new
                    {                        
                        messenger,
                    }));
                }
                else
                {
                    int SL = ShopCart.iSoLuongBan + iSoLuong;
                    if (SL<=SanPham.SoLuong || SL >= SanPham.SoLuong)
                    {
                        ShopCart.iSoLuongBan = ShopCart.iSoLuongBan + iSoLuong;
                        ShopCart.ThanhTien = ShopCart.iSoLuongBan * ShopCart.iGiaBan;
                        List<ShopCart> listShopCart = Session["ShopCart"] as List<ShopCart>;
                        messenger.IsSuccess = true;
                        messenger.Message = "Thêm sản phẩm vào giỏ thành công!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            listShopCart,
                            messenger,
                        }));
                    }
                    else
                    {
                        messenger.IsSuccess = false;
                        messenger.Message = "Sản phẩm này chỉ còn lại" + " " + SanPham.SoLuong + " " + "không thể đặt được quá số lượng còn lại!!!";
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
                messenger.Message = "Sản phẩm này chỉ còn lại" + " " + SanPham.SoLuong + " " + "không thể đặt được quá số lượng còn lại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

        }
        public ActionResult DeleteShopCart(int iMaSP)
        {
            List<ShopCart> ListShopCart = GetListCart();
            ShopCart ShopCart = ListShopCart.Find(n => n.iMaSP == iMaSP);
            if (ShopCart != null)
            {
                ListShopCart.RemoveAll(n => n.iMaSP == iMaSP);
                messenger.IsSuccess = true;
                messenger.Message = "Xóa sản phẩm thành công!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            else
            {
                messenger.IsSuccess = false;
                messenger.Message = "sản phẩm này không tồn tại trong giỏ!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

        }
        public ActionResult GetSP(int iMaSP)
        {
            var result = db.SanPhams.Where(s => s.MaSP == iMaSP).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult Update(int iMaSP, int iSoLuong)
        {
            SanPham SanPham = db.SanPhams.Find(iMaSP);
            if (SanPham == null)
            {
                messenger.IsSuccess = false;
                messenger.Message = "sản phẩm không tồn tại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }

            if (SanPham.SoLuong >= 0 )
            {
                List<ShopCart> ListShopCart = GetListCart();
                ShopCart ShopCart = ListShopCart.Find(n => n.iMaSP == iMaSP);
                if (ShopCart == null)
                {
                    ShopCart = new ShopCart(iMaSP);
                    ShopCart.iSoLuongBan = iSoLuong;
                    ShopCart.ThanhTien = ShopCart.iSoLuongBan * ShopCart.iGiaBan;
                    ListShopCart.Add(ShopCart);
                    List<ShopCart> listShopCart = Session["ShopCart"] as List<ShopCart>;
                    messenger.IsSuccess = true;
                    messenger.Message = "Thêm sản phẩm vào giỏ thành công!!!";
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                    }));
                }
                else
                {
                    int SL = iSoLuong;
                    if (SL <= SanPham.SoLuong || SL >= SanPham.SoLuong)
                    {
                        ShopCart.iSoLuongBan = iSoLuong;
                        ShopCart.ThanhTien = ShopCart.iSoLuongBan * ShopCart.iGiaBan;
                        List<ShopCart> listShopCart = Session["ShopCart"] as List<ShopCart>;
                        messenger.IsSuccess = true;
                        messenger.Message = "Cập nhập giỏ hàng thành công!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            listShopCart,
                            messenger,
                        }));
                    }
                    else
                    {
                        messenger.IsSuccess = false;
                        messenger.Message = "Sản phẩm này chỉ còn lại" + " " + SanPham.SoLuong + " " + "không thể đặt được quá số lượng còn lại!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger,
                        }));

                    }

                }
            }
            return View();
        }
    }
}