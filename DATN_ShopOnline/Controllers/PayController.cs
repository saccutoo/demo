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
    public class PayController : Controller
    {
        // GET: Pay
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public ActionResult Index()
        {
            if (Session["ShopCart"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Index", "HomeShop");
            }
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
        public ActionResult LoadCity()
        {
            var result = db.ThanhPhos.ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult LoadDistrict(int MaHuyen)
        {
            var result = db.Huyens.Where(s => s.MaThanhPho == MaHuyen).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult LoadDistrictHY()
        {
            var result = db.Huyens.Where(s => s.MaThanhPho == 1).ToList();
            return Content(JsonConvert.SerializeObject(new
            {
                result,
            }));
        }
        public ActionResult Order(KhachHang kh, DonBan dh)
        {
            var listShopCart = Session["ShopCart"] as List<ShopCart>;
            List<ShopCart> listShop = GetListCart();

            if (kh != null)
            {

                if (kh.MaKH != 0)
                {

                    #region khách hàng có tài khoản
                    KhachHang KH = db.KhachHangs.Find(kh.MaKH);
                    if (KH.MaThanhPho == null || KH.MaHuyen == null)
                    {
                        KH.MaThanhPho = kh.MaThanhPho;
                        KH.MaHuyen = kh.MaHuyen;
                        db.Entry(KH).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    dh.MaKH = kh.MaKH;
                    var date = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
                    string[] ListDate = date.Split(' ');
                    string[] ListCalendar = ListDate[0].Split('/');
                    dh.NamDat = Convert.ToInt32(ListCalendar[2]);
                    dh.ThangDat = Convert.ToInt32(ListCalendar[1]);
                    dh.NgayDat = Convert.ToInt32(ListCalendar[0]);
                    dh.GioDat = ListDate[1].ToString();
                    dh.TongTien = Convert.ToDouble(listShopCart.Sum(n => n.ThanhTien)) + dh.PhiShip;
                    dh.TrangThai = 0;
                    dh.Trangthaixem = false;
                    db.DonBans.Add(dh);
                    db.SaveChanges();
                    int MaDB = dh.MaDB;
                    foreach (var item in listShop)
                    {
                        ChiTietDonBan CTDH = new ChiTietDonBan();
                        CTDH.MaDB = MaDB;
                        CTDH.MaSP = item.iMaSP;
                        CTDH.SoLuong = item.iSoLuongBan;
                        SanPham sp = db.SanPhams.Find(item.iMaSP);
                        CTDH.ThanhTien = sp.GiaBan * item.iSoLuongBan;
                        CTDH.NamDat = Convert.ToInt32(ListCalendar[2]);
                        CTDH.ThangDat = Convert.ToInt32(ListCalendar[1]);
                        CTDH.NgayDat = Convert.ToInt32(ListCalendar[0]);
                        CTDH.GioDat = ListDate[1].ToString();
                        CTDH.TrangThai = 0;
                        CTDH.TrangThaiThanhToan = dh.TrangThaiThanhToan;
                        db.ChiTietDonBans.Add(CTDH);
                        db.SaveChanges();
                    }
                    #endregion
                        #region Gửi mail
                    //int i = 1;
                    //CultureInfo cul = CultureInfo.GetCultureInfo("vi-VN");
                    //double TT = Convert.ToDouble(listShopCart.Sum(n => n.ThanhTien)) + dh.PhiShip;
                    //string PhiShip = dh.PhiShip.ToString("#,###", cul.NumberFormat);
                    //string TongTien = TT.ToString("#,###", cul.NumberFormat);
                    //ThanhPho TP = db.ThanhPhos.Find(kh.MaThanhPho);
                    //Huyen huyen = db.Huyens.Find(kh.MaHuyen);

                    //var Body = "";
                    //Body += " <html>";
                    //Body += "<body>";

                    //Body += "<p style='font-weight:bold'>Họ và tên:" + "<span style='font-weight:lighter;'>" + " " + kh.TenKH + "</span>" + "</p>";
                    //Body += "<p style='font-weight:bold'>Địa chỉ:" + "<span style='font-weight:lighter;'>" + " " + kh.DiaChi +" - "+ huyen.TenHuyen+ " - " + TP.TenThanhPho + "</span>" + "</p>";
                    //Body += "<p style='font-weight:bold'>Số điện thoại:" + "<span style='font-weight:lighter;'>" + " " + 0 + "" + kh.SDT + "</span>" + "</p>";

                    //Body += "<table border='1' width='1000' class='table table-striped table-bordered table-hover'>";
                    //Body += "<tr  style='text-align:center' class='success'>";
                    //Body += "<td colspan='5'><h3>Đơn hàng của bạn từ Rượu plaza</h3> </td>";
                    //Body += "</tr>";

                    //Body += "<tr  style='text-align:center'>";
                    //Body += "<td>STT</td> <td> Tên sản phẩm </td><td> Số lượng </td><td> Đơn giá </td> <td> Thành tiền</td>";
                    //Body += "<tr >";

                    //foreach (var item in listShop)
                    //{
                    //    string GiaBan = item.iGiaBan.ToString("#,###", cul.NumberFormat);
                    //    string Monney = (item.iSoLuongBan * item.iGiaBan).ToString("#,###", cul.NumberFormat);

                    //    Body += "<tr >";
                    //    Body += "<td style='text-align:center;'> " + (i++) + "</td>" + "<td  style='text-align:left;'> " + "<p style='margin-left:20px;'>" + item.iTenSP + "</p>" + "</td>" + "<td style='text-align:center;color:red'> " + item.iSoLuongBan + "</td>" + "<td style='text-align:center;color:red'> " + GiaBan + "</td>" + "<td style='text-align:center;color:red'> " + Monney + "</td>";
                    //    Body += "<tr >";
                    //}

                    //Body += "</table>";
                    //Body += "<p style='font-weight:bold'>Phí ship:" + "<span style='font-weight:lighter;color:red'>" + " " + PhiShip + " " + "₫" + "</span>" + "</p>";
                    //Body += "<p style='font-weight:bold'>Tổng tiền:" + "<span style='font-weight:lighter;color:red'>" + " " + TongTien + " " + "₫" + "</span>" + "</p>";
                    //Body += "<p>Đơn hàng của bạn đã được xử lý.Trong vòng 1 tuần đơn hàng sẽ đến địa chỉ của bạn mong bạn hãy kiểm tra sản phẩm trước khi thanh toán.Cảm ơn bạn rất nhiều chúc bạn có một ngày mới vui vẻ <3 !!!</p>";
                    //Body += "</body>";
                    //Body += "</html>";
                    //var Mail = SendMail(Body, kh.Gmail);
                    #endregion
                    #region mail thông báo
                    var Body = "";
                    Body += " <html>";
                    Body += "<body>";
                    Body += "<p>Cảm ơn bạn đã đặt hàng từ Shop.Đơn hàng của bạn sẽ được xử lý sớm nhất có thể.Chúc bạn có một ngày vui vẻ <3 !!! </p>";
                    Body += "<a href='http://localhost:56127/HomeShop/Index' style='color:blue'> Tiếp tục mua hàng </a>";
                    Body += "</body>";
                    Body += " </html>";
                    //var Mail = SendMail(Body, kh.Gmail);

                    Session["ShopCart"] = null;
                    Session["MaDB"] = MaDB;
                    messenger.IsSuccess = true;
                    messenger.Message = MaDB.ToString();


                    var Mail = SendMail(Body, kh.Gmail);

                    messenger.IsSuccess = true;
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result = messenger,
                    }));
                    #endregion
                }
                else
                {

                    #region khách hàng không có tài khoản
                    db.KhachHangs.Add(kh);
                    db.SaveChanges();
                    int MaKH = kh.MaKH;
                    dh.MaKH = MaKH;
                    var date = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
                    string[] ListDate = date.Split(' ');
                    string[] ListCalendar = ListDate[0].Split('/');
                    dh.NamDat = Convert.ToInt32(ListCalendar[2]);
                    dh.ThangDat = Convert.ToInt32(ListCalendar[1]);
                    dh.NgayDat = Convert.ToInt32(ListCalendar[0]);
                    dh.GioDat = ListDate[1].ToString();
                    dh.TongTien = Convert.ToDouble(listShopCart.Sum(n => n.ThanhTien)) + dh.PhiShip;
                    dh.TrangThai = 0;
                    dh.Trangthaixem = false;
                    db.DonBans.Add(dh);
                    db.SaveChanges();
                    int MaDB = dh.MaDB;
                    foreach (var item in listShop)
                    {
                        ChiTietDonBan CTDH = new ChiTietDonBan();
                        CTDH.MaDB = MaDB;
                        CTDH.MaSP = item.iMaSP;
                        CTDH.SoLuong = item.iSoLuongBan;
                        SanPham sp = db.SanPhams.Find(item.iMaSP);
                        CTDH.ThanhTien = sp.GiaBan * item.iSoLuongBan;
                        date = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
                        var ListDate1 = date.Split(' ');
                        CTDH.NamDat = Convert.ToInt32(ListCalendar[2]);
                        CTDH.ThangDat = Convert.ToInt32(ListCalendar[1]);
                        CTDH.NgayDat = Convert.ToInt32(ListCalendar[0]);
                        CTDH.GioDat = ListDate[1].ToString();
                        CTDH.TrangThai = 0;
                        CTDH.TrangThaiThanhToan = dh.TrangThaiThanhToan;
                        db.ChiTietDonBans.Add(CTDH);
                        db.SaveChanges();

                    }
                    #endregion

                    #region mail thông báo
                    var Body = "";
                    Body += " <html>";
                    Body += "<body>";
                    Body += "<p>Cảm ơn bạn đã đặt hàng từ Shop.Đơn hàng của bạn sẽ được xử lý sớm nhất có thể.Chúc bạn có một ngày vui vẻ <3 !!! </p>";
                    Body += "<a href='http://localhost:56127/HomeShop/Index' style='color:blue'> Tiếp tục mua hàng </a>";
                    Body += "</body>";
                    Body += " </html>";
                    var Mail = SendMail(Body, kh.Gmail);
                    Session["ShopCart"] = null;
                    Session["MaDB"] = MaDB;
                    messenger.IsSuccess = true;
                    messenger.Message = MaDB.ToString();
                    return Content(JsonConvert.SerializeObject(new
                    {
                        result = messenger,
                    }));
                    #endregion

                }
            }

            return View();
        }
        public Messenger SendMail(string body, string ToMail)
        {
            try
            {
                MailMessage message = new MailMessage(new MailAddress("kimlam2207@gmail.com", "RuouPlaza.com"), new MailAddress(ToMail));

                message.Subject = "Thông tin đơn hàng từ RuouPlaza.com";
                message.IsBodyHtml = true;
                message.Body = body;
                SmtpClient smtp = new SmtpClient();
                smtp.UseDefaultCredentials = false;
                smtp.Host = "smtp.gmail.com"; //Or Your SMTP Server Address                  
                smtp.Credentials = new NetworkCredential("kimlam2207@gmail.com", "tranlam123");
                //client.UseDefaultCredentials = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.EnableSsl = true;
                smtp.Port = 587;

                smtp.Send(message);
                messenger.Message = "Gửi mail thành công";
                messenger.IsSuccess = false;
                return messenger;
            }
            catch (Exception e)
            {
                messenger.Message = "Gửi mail thất bại";
                messenger.IsSuccess = false;
                return messenger;
            }
        }
        public Messenger SendMailFiledonwload(string body, string ToMail)
        {
            try
            {
                MailMessage message = new MailMessage(new MailAddress("kimlam2207@gmail.com", "RuouPlaza.com"), new MailAddress(ToMail));

                message.Subject = "Thông tin đơn hàng từ RuouPlaza.com";
                message.IsBodyHtml = true;

                string path = Server.MapPath("~/img/1469936020.png");
                LinkedResource logo = new LinkedResource(path);
                logo.ContentId = "companylogo";

                //Gửi file download
                AlternateView av1 = AlternateView.CreateAlternateViewFromString(
                      "<html><body><img src=cid:companylogo/>",
                      null, MediaTypeNames.Text.Html);

                //now add the AlternateView
                av1.LinkedResources.Add(logo);
                message.AlternateViews.Add(av1);

                SmtpClient smtp = new SmtpClient();
                smtp.UseDefaultCredentials = false;
                smtp.Host = "smtp.gmail.com"; //Or Your SMTP Server Address                  
                smtp.Credentials = new NetworkCredential("kimlam2207@gmail.com", "tranlam123");
                //client.UseDefaultCredentials = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.EnableSsl = true;
                smtp.Port = 587;

                smtp.Send(message);
                messenger.Message = "Gửi mail thành công";
                messenger.IsSuccess = false;
                return messenger;
            }
            catch (Exception e)
            {
                messenger.Message = "Gửi mail thất bại";
                messenger.IsSuccess = false;
                return messenger;
            }
        }
        public Messenger SendMailImg(KhachHang kh, DonBan dh)
        {
            var listShopCart = Session["ShopCart"] as List<ShopCart>;
            List<ShopCart> listShop = GetListCart();
            try
            {
                MailMessage message = new MailMessage(new MailAddress("kimlam2207@gmail.com", "RuouPlaza.com"), new MailAddress(kh.Gmail));
                
                message.Subject = "Thông tin đơn hàng từ RuouPlaza.com";
                message.IsBodyHtml = true;

                #region Gửi mail
                int i = 1;
                CultureInfo cul = CultureInfo.GetCultureInfo("vi-VN");
                double TT = Convert.ToDouble(listShopCart.Sum(n => n.ThanhTien)) + dh.PhiShip;
                string PhiShip = dh.PhiShip.ToString("#,###", cul.NumberFormat);
                string TongTien = TT.ToString("#,###", cul.NumberFormat);
                //TongTien = TongTien.Replace(".", ",");
                ThanhPho TP = db.ThanhPhos.Find(kh.MaThanhPho);
                Huyen huyen = db.Huyens.Find(kh.MaHuyen);

                var inlineLogo = new LinkedResource(Server.MapPath("~/Img/1469936020.png"), "image/png");
                var Body = "";

                Body += " <html>";
                Body += "<body>";

                Body += "<p style='font-weight:bold'>Họ và tên:" + "<span style='font-weight:lighter;'>" + " " + kh.TenKH + "</span>" + "</p>";
                Body += "<p style='font-weight:bold'>Địa chỉ:" + "<span style='font-weight:lighter;'>" + " " + kh.DiaChi + " - " + huyen.TenHuyen + " - " + TP.TenThanhPho + "</span>" + "</p>";
                Body += "<p style='font-weight:bold'>Số điện thoại:" + "<span style='font-weight:lighter;'>" + " " + 0 + "" + kh.SDT + "</span>" + "</p>";

                Body += "<table border='1' width='1000' class='table table-striped table-bordered table-hover'>";
                Body += "<tr  style='text-align:center' class='success'>";
                Body += "<td colspan='6'><h3>Đơn hàng của bạn từ Rượu plaza</h3> </td>";
                Body += "</tr>";

                Body += "<tr  style='text-align:center'>";
                Body += "<td>STT</td> <td>Hình ảnh</td> <td> Tên sản phẩm </td><td> Số lượng </td><td> Đơn giá </td> <td> Thành tiền</td>";
                Body += "<tr >";

                foreach (var item in listShop)
                {
                    inlineLogo = new LinkedResource(Server.MapPath("~/Img/"+item.iHinhAnh), "image/png");
                    inlineLogo.ContentId = Guid.NewGuid().ToString();
                    inlineLogo.ContentType.MediaType = "image/png";

                    string body1 = string.Format(@"<img src='cid:{0}' width='50'/>", inlineLogo.ContentId);

                    string GiaBan = item.iGiaBan.ToString("#,###", cul.NumberFormat);
                    string Monney = (item.iSoLuongBan * item.iGiaBan).ToString("#,###", cul.NumberFormat);

                    Body += "<tr >";
                    Body += "<td style='text-align:center;'> " + (i++) + "</td>"+ "<td style='text-align:center;'> " + body1 + "</td>" + "<td  style='text-align:left;'> " + "<p style='margin-left:20px;'>" + item.iTenSP + "</p>" + "</td>" + "<td style='text-align:center;color:red'> " + item.iSoLuongBan + "</td>" + "<td style='text-align:center;color:red'> " + GiaBan + "</td>" + "<td style='text-align:center;color:red'> " + Monney + "</td>";
                    Body += "<tr >";
                }

                Body += "</table>";
                Body += "<p style='font-weight:bold'>Phí ship:" + "<span style='font-weight:lighter;color:red'>" + " " + PhiShip + " " + "₫" + "</span>" + "</p>";
                Body += "<p style='font-weight:bold'>Tổng tiền:" + "<span style='font-weight:lighter;color:red'>" + " " + TongTien + " " + "₫" + "</span>" + "</p>";
                Body += "<p>Đơn hàng của bạn đã được xử lý.Trong vòng 1 tuần đơn hàng sẽ đến địa chỉ của bạn mong bạn hãy kiểm tra sản phẩm trước khi thanh toán.Cảm ơn bạn rất nhiều chúc bạn có một ngày mới vui vẻ <3 !!!</p>";
                Body += "</body>";
                Body += "</html>";
                #endregion

               

                var view = AlternateView.CreateAlternateViewFromString(Body, null, "text/html");
                view.LinkedResources.Add(inlineLogo);
                message.AlternateViews.Add(view);




                SmtpClient smtp = new SmtpClient();
                smtp.UseDefaultCredentials = false;
                smtp.Host = "smtp.gmail.com"; //Or Your SMTP Server Address                  
                smtp.Credentials = new NetworkCredential("kimlam2207@gmail.com", "tranlam123");
                //client.UseDefaultCredentials = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.EnableSsl = true;
                smtp.Port = 587;

                smtp.Send(message);
                messenger.Message = "Gửi mail thành công";
                messenger.IsSuccess = false;
                return messenger;
            }
            catch (Exception e)
            {
                messenger.Message = "Gửi mail thất bại";
                messenger.IsSuccess = false;
                return messenger;
            }
        }
    }
}