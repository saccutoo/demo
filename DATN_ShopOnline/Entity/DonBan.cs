namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("DonBan")]
    public partial class DonBan
    {
        [Key]
        public int MaDB { get; set; }

        public int MaKH { get; set; }

        public int? NgayDat { get; set; }

        public int? ThangDat { get; set; }

        public int NamDat { get; set; }

        [StringLength(50)]
        public string GioDat { get; set; }

        public double PhiShip { get; set; }
        public double? TongTien { get; set; }
        public int PhuongThuc { get; set; }

        public bool? TrangThaiThanhToan { get; set; }
        public int? TrangThai { get; set; }
        public bool? Trangthaixem { get; set; }
        public virtual KhachHang KHACHHANG { get; set; }
        public virtual ICollection<ChiTietDonBan> CHITIETDONBAN { get; set; }

    }
}
