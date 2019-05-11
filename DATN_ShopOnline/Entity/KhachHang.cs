namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("KhachHang")]
    public partial class KhachHang
    {
        [Key]
        public int MaKH { get; set; }

        [StringLength(50)]
        public string TenKH { get; set; }

        public decimal? SDT { get; set; }

        [StringLength(3)]
        public string GioiTinh { get; set; }

        public DateTime? NgaySinh { get; set; }

        [StringLength(100)]
        public string DiaChi { get; set; }

        [StringLength(100)]
        public string Gmail { get; set; }

        [StringLength(50)]
        public string TaiKhoan { get; set; }

        public int? MaThanhPho { get; set; }
        public int? MaHuyen { get; set; }
        public virtual ThanhPho THANHPHO { get; set; }
        public virtual Huyen HUYEN { get; set; }

       
    }
}
