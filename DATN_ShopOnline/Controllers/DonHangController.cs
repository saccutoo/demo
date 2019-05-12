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
using System.Globalization;

namespace DATN_ShopOnline.Controllers
{
    public class DonHangController : BaseAdminController
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
        public ActionResult Timkiem(int? TrangThai,string NgayDat)
        {
            if (TrangThai!= null && NgayDat !=null)
            {
                string[] words = NgayDat.Split('/');                             
                int index = words[0].IndexOf("0");
                if (index == 0)
                {
                    words[0] = words[0].Remove(0, 1);

                }
                index = words[1].IndexOf("0");
                if (index == 0)
                {
                    words[1] = words[1].Remove(0, 1);

                }
                int NgayDat1 = Convert.ToInt16(words[0]);
                int ThangDat = Convert.ToInt16(words[1]);
                int NamDat = Convert.ToInt16(words[2]);

                var result = db.DonBans.Include(s => s.KHACHHANG).Where(s => s.TrangThai == TrangThai).Where(s => s.NgayDat == NgayDat1).Where(s => s.ThangDat == ThangDat).Where(s => s.NamDat == NamDat).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else if (TrangThai != null && NgayDat == null)
            {
                var result = db.DonBans.Include(s => s.KHACHHANG).Where(s => s.TrangThai == TrangThai).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else if (TrangThai == null && NgayDat != null)
            {
                string[] words = NgayDat.Split('/');
                int index = words[0].IndexOf("0");

                if (index==0)
                {
                    words[0] = words[0].Remove(0, 1);

                }
                index = words[1].IndexOf("0");
                if (index == 0)
                {
                    words[1] = words[1].Remove(0, 1);

                }
                int NgayDat1 = Convert.ToInt16(words[0]);
                int ThangDat = Convert.ToInt16(words[1]);
                int NamDat = Convert.ToInt16(words[2]);
                var result = db.DonBans.Include(s => s.KHACHHANG).Where(s => s.NgayDat == NgayDat1).Where(s => s.ThangDat == ThangDat).Where(s => s.NamDat == NamDat).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }
            else
            {
                var result = db.DonBans.Include(s => s.KHACHHANG).ToList();
                return Content(JsonConvert.SerializeObject(new
                {
                    result,
                }));
            }


        }

        public ActionResult Delete(int [] data)
        {
            bool Check = Permission("DonHang", "Delete");
            if (Check == true)
            {
                try
                {
                    for (int i = 0; i < data.Length; i++)
                    {
                        var MaDB = data[i];
                        DonBan dh = db.DonBans.Find(MaDB);
                        db.DonBans.Remove(dh);
                        db.SaveChanges();

                        var ctdh = db.ChiTietDonBans.Where(s => s.MaDB == MaDB).ToList();
                        if (ctdh != null)
                        {
                            foreach (var item in ctdh)
                            {
                                ChiTietDonBan ctdb = db.ChiTietDonBans.Find(item.MaCTDB);
                                db.ChiTietDonBans.Remove(ctdb);
                                db.SaveChanges();
                            }
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
            else
            {
                messenger.IsSuccess = false;
                messenger.RedirectToAction = true;
                messenger.Message = "Thêm sản phẩm thất bại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
           

        }

        public ActionResult SaveDonHang()
        {
            return View();
        }

        public ActionResult ConvertDH(int MaDB, int TrangThai, bool TrangThaiThanhToan)
        {
            bool Check = Permission("DonHang", "Submit");
            if (Check == true)
            {
                DonBan dh = db.DonBans.Find(MaDB);
                int MaKH = dh.MaKH;               
                dh.TrangThai = TrangThai;
                if (TrangThai == 3)
                {
                    dh.TrangThaiThanhToan = true;
                }
                else
                {
                    dh.TrangThaiThanhToan = TrangThaiThanhToan;
                }
                db.Entry(dh).State = EntityState.Modified;

                var ListCTDB = db.ChiTietDonBans.Where(s => s.MaDB == MaDB).ToList();
                if (ListCTDB != null)
                {
                    foreach (var item in ListCTDB)
                    {
                        ChiTietDonBan CTDB = db.ChiTietDonBans.Find(item.MaCTDB);
                        CTDB.TrangThai = TrangThai;
                        if (TrangThai==3)
                        {
                            CTDB.TrangThaiThanhToan = true;
                        }
                        else
                        {
                            CTDB.TrangThaiThanhToan = false;
                        }
                        db.Entry(CTDB).State = EntityState.Modified;
                    }
                }

                #region Gửi mail
                int i = 1;
                CultureInfo cul = CultureInfo.GetCultureInfo("vi-VN");

                //double TT = Convert.ToDouble(listShopCart.Sum(n => n.ThanhTien)) + dh.PhiShip;
                //string PhiShip = dh.PhiShip.ToString("#,###", cul.NumberFormat);
                //string TongTien = TT.ToString("#,###", cul.NumberFormat);
                //ThanhPho TP = db.ThanhPhos.Find(kh.MaThanhPho);
                //Huyen huyen = db.Huyens.Find(kh.MaHuyen);

                string TongTien = dh.TongTien.Value.ToString("#,###", cul.NumberFormat);
                string PhiShip = dh.PhiShip.ToString("#,###", cul.NumberFormat);
                KhachHang kh = db.KhachHangs.Find(MaKH);
                ThanhPho TP = db.ThanhPhos.Find(kh.MaThanhPho);
                Huyen huyen = db.Huyens.Find(kh.MaHuyen);

                var ListCTDB1 = db.ChiTietDonBans.Include(s => s.SANPHAM).Where(s => s.MaDB == MaDB).ToList();

                var Body = "";
                Body += " <html>";
                Body += "<body>";

                Body += "<p style='font-weight:bold'>Họ và tên:" + "<span style='font-weight:lighter;'>" + " " + kh.TenKH + "</span>" + "</p>";
                Body += "<p style='font-weight:bold'>Địa chỉ:" + "<span style='font-weight:lighter;'>" + " " + kh.DiaChi + " - " + huyen.TenHuyen + " - " + TP.TenThanhPho + "</span>" + "</p>";
                Body += "<p style='font-weight:bold'>Số điện thoại:" + "<span style='font-weight:lighter;'>" + " " + 0 + "" + kh.SDT + "</span>" + "</p>";

                Body += "<table border='1' width='1000' class='table table-striped table-bordered table-hover'>";
                Body += "<tr  style='text-align:center' class='success'>";
                Body += "<td colspan='5'><h3>Đơn hàng của bạn từ Rượu plaza</h3> </td>";
                Body += "</tr>";

                Body += "<tr  style='text-align:center'>";
                Body += "<td>STT</td> <td> Tên sản phẩm </td><td> Số lượng </td><td> Đơn giá </td> <td> Thành tiền</td>";
                Body += "<tr >";

                foreach (var item in ListCTDB1)
                {
                    string GiaBan = item.SANPHAM.GiaBan.Value.ToString("#,###", cul.NumberFormat);
                    string Monney = (item.SoLuong.Value * item.SANPHAM.GiaBan.Value).ToString("#,###", cul.NumberFormat);

                    Body += "<tr >";
                    Body += "<td style='text-align:center;'> " + (i++) + "</td>" + "<td  style='text-align:left;'> " + "<p style='margin-left:20px;font-weight:bold'>" + item.SANPHAM.TenSP + "</p>" + "</td>" + "<td style='text-align:center;color:red'> " + item.SoLuong + "</td>" + "<td style='text-align:center;color:red'> " + GiaBan + "</td>" + "<td style='text-align:center;color:red'> " + Monney + "</td>";
                    Body += "<tr >";
                }

                Body += "</table>";
                Body += "<p style='font-weight:bold'>Phí ship:" + "<span style='font-weight:lighter;color:red'>" + " " + PhiShip + " " + "₫" + "</span>" + "</p>";
                Body += "<p style='font-weight:bold'>Tổng tiền:" + "<span style='font-weight:lighter;color:red'>" + " " + TongTien + " " + "₫" + "</span>" + "</p>";
                Body += "<p>Đơn hàng của bạn đã được xử lý.Trong vòng 1 tuần đơn hàng sẽ đến địa chỉ của bạn mong bạn hãy kiểm tra sản phẩm trước khi thanh toán.Cảm ơn bạn rất nhiều chúc bạn có một ngày mới vui vẻ <3 !!!</p>";
                Body += "</body>";
                Body += "</html>";

                #endregion

                if (TrangThai==1)
                {
                    var Mail = SendMail(Body, kh.Gmail);
                    if (Mail.IsSuccess == true)
                    {
                        db.SaveChanges();
                        messenger.IsSuccess = true;
                        messenger.Message = "Cập nhập thành công!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger,
                        }));
                    }
                    else
                    {
                        messenger.IsSuccess = false;
                        messenger.Message = "Cập nhập thất bại!!!";
                        return Content(JsonConvert.SerializeObject(new
                        {
                            messenger,
                        }));
                    }
                }
                else
                {
                    db.SaveChanges();
                    messenger.IsSuccess = true;
                    messenger.Message = "Cập nhập thành công!!!";
                    return Content(JsonConvert.SerializeObject(new
                    {
                        messenger,
                    }));
                }
               
            }
            else
            {
                messenger.IsSuccess = false;
                messenger.RedirectToAction = true;
                messenger.Message = "Cập nhập thất bại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
        }

        public ActionResult ConvertList()
        {
            return View();
        }
        public ActionResult ConvertListDH(int []data, int TrangThai, bool TrangThaiThanhToan)
        {
            bool Check = Permission("DonHang", "Submit");
            if (Check == true)
            {
                for (int i = 0; i < data.Length; i++)
                {
                    int MaDB = data[i];
                    DonBan dh = db.DonBans.Find(MaDB);
                    int MaKH = dh.MaKH;
                    dh.TrangThai = TrangThai;
                    dh.TrangThaiThanhToan = TrangThaiThanhToan;
                    db.Entry(dh).State = EntityState.Modified;

                    var ListCTDH = db.ChiTietDonBans.Where(s => s.MaDB == MaDB).ToList();
                    if (ListCTDH!=null)
                    {
                        foreach (var item in ListCTDH)
                        {
                            ChiTietDonBan CTDB = db.ChiTietDonBans.Find(item.MaCTDB);
                            CTDB.TrangThai = TrangThai;
                            CTDB.TrangThaiThanhToan = TrangThaiThanhToan;
                            db.Entry(CTDB).State = EntityState.Modified;
                        }
                    }
                    if (TrangThai==1)
                    {
                        #region Gửi mail
                        int j = 1;
                        CultureInfo cul = CultureInfo.GetCultureInfo("vi-VN");

                        string TongTien = dh.TongTien.Value.ToString("#,###", cul.NumberFormat);
                        string PhiShip = dh.PhiShip.ToString("#,###", cul.NumberFormat);
                        KhachHang kh = db.KhachHangs.Find(MaKH);
                        ThanhPho TP = db.ThanhPhos.Find(kh.MaThanhPho);
                        Huyen huyen = db.Huyens.Find(kh.MaHuyen);

                        var ListCTDB1 = db.ChiTietDonBans.Include(s => s.SANPHAM).Where(s => s.MaDB == MaDB).ToList();

                        var Body = "";
                        Body += " <html>";
                        Body += "<body>";

                        Body += "<p style='font-weight:bold'>Họ và tên:" + "<span style='font-weight:lighter;'>" + " " + kh.TenKH + "</span>" + "</p>";
                        Body += "<p style='font-weight:bold'>Địa chỉ:" + "<span style='font-weight:lighter;'>" + " " + kh.DiaChi + " - " + huyen.TenHuyen + " - " + TP.TenThanhPho + "</span>" + "</p>";
                        Body += "<p style='font-weight:bold'>Số điện thoại:" + "<span style='font-weight:lighter;'>" + " " + 0 + "" + kh.SDT + "</span>" + "</p>";

                        Body += "<table border='1' width='1000' class='table table-striped table-bordered table-hover'>";
                        Body += "<tr  style='text-align:center' class='success'>";
                        Body += "<td colspan='5'><h3>Đơn hàng của bạn từ Rượu plaza</h3> </td>";
                        Body += "</tr>";

                        Body += "<tr  style='text-align:center'>";
                        Body += "<td>STT</td> <td> Tên sản phẩm </td><td> Số lượng </td><td> Đơn giá </td> <td> Thành tiền</td>";
                        Body += "<tr >";

                        foreach (var item in ListCTDB1)
                        {
                            string GiaBan = item.SANPHAM.GiaBan.Value.ToString("#,###", cul.NumberFormat);
                            string Monney = (item.SoLuong.Value * item.SANPHAM.GiaBan.Value).ToString("#,###", cul.NumberFormat);

                            Body += "<tr >";
                            Body += "<td style='text-align:center;'> " + (j++) + "</td>" + "<td  style='text-align:left;'> " + "<p style='margin-left:20px;font-weight:bold'>" + item.SANPHAM.TenSP + "</p>" + "</td>" + "<td style='text-align:center;color:red'> " + item.SoLuong + "</td>" + "<td style='text-align:center;color:red'> " + GiaBan + "</td>" + "<td style='text-align:center;color:red'> " + Monney + "</td>";
                            Body += "<tr >";
                        }

                        Body += "</table>";
                        Body += "<p style='font-weight:bold'>Phí ship:" + "<span style='font-weight:lighter;color:red'>" + " " + PhiShip + " " + "₫" + "</span>" + "</p>";
                        Body += "<p style='font-weight:bold'>Tổng tiền:" + "<span style='font-weight:lighter;color:red'>" + " " + TongTien + " " + "₫" + "</span>" + "</p>";
                        Body += "<p>Đơn hàng của bạn đã được xử lý.Trong vòng 1 tuần đơn hàng sẽ đến địa chỉ của bạn mong bạn hãy kiểm tra sản phẩm trước khi thanh toán.Cảm ơn bạn rất nhiều chúc bạn có một ngày mới vui vẻ <3 !!!</p>";
                        Body += "</body>";
                        Body += "</html>";

                        #endregion
                        var Mail = SendMail(Body, kh.Gmail);                        
                    }

                }
                db.SaveChanges();
                messenger.IsSuccess = true;
                messenger.Message = "Cập nhập thành công!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
            else
            {
                messenger.IsSuccess = false;
                messenger.RedirectToAction = true;
                messenger.Message = "Thêm sản phẩm thất bại!!!";
                return Content(JsonConvert.SerializeObject(new
                {
                    messenger,
                }));
            }
        }
    }
}