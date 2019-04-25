namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("DonNhap")]
    public partial class DonNhap
    {
        [Key]
        public int MaDN { get; set; }

        public int? MaNCC { get; set; }

        public double? TongTien { get; set; }

        public int? NgayNhap { get; set; }

        public int? ThangNhap { get; set; }

        public int? NamNhap { get; set; }

        [StringLength(50)]
        public string GioNhap { get; set; }

        public int? TrangThai { get; set; }
    }
}
