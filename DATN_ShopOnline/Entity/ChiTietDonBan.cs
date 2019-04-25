namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ChiTietDonBan")]
    public partial class ChiTietDonBan
    {
        [Key]
        public int MaCTDB { get; set; }

        public int? MaDB { get; set; }

        public int? MaSP { get; set; }

        public int? SoLuong { get; set; }

        public double? ThanhTien { get; set; }

        public int? NgayDat { get; set; }

        public int? ThangDat { get; set; }

        public int? NamDat { get; set; }

        [StringLength(50)]
        public string GioDat { get; set; }
        public bool? TrangThaiThanhToan { get; set; }
        public int? TrangThai { get; set; }
        public virtual SanPham SANPHAM { get; set; }

    }
}
