using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DATN_ShopOnline.Entity;

namespace DATN_ShopOnline
{
    public class ShopCart
    {
        ShopOnline db = new ShopOnline();
        public int iMaSP { get; set; }
        public string iTenSP { get; set; }
        public int iSoLuong { get; set; }
        public int iSoLuongBan { get; set; }
        public int iSoLuongDaBan { get; set; }
        public string iHinhAnh { get; set; }
        public double iGiaBan { get; set; }
        public double ThanhTien { get; set; }
        public ShopCart(int MaSP)
        {
            iMaSP = MaSP;
            SanPham sanpham = db.SanPhams.Single(n => n.MaSP == iMaSP);
            iTenSP = sanpham.TenSP;
            iSoLuongBan = 1;
            iHinhAnh = sanpham.HinhAnh;
            iGiaBan = Convert.ToDouble(sanpham.GiaBan);
            ThanhTien = iSoLuongBan * iGiaBan;
        }
    }
}