namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ChiTietDonNhap")]
    public partial class ChiTietDonNhap
    {
        [Key]
        public int MaCTDN { get; set; }

        public int? MaDN { get; set; }

        public int? MaSP { get; set; }

        public int? SoLuong { get; set; }

        public double? ThanhTien { get; set; }

        public int? NgayNhap { get; set; }

        public int? ThangNhap { get; set; }

        public int? NamNhap { get; set; }

        public int? TrangThai { get; set; }
    }
}
