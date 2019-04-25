namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("RepBinhLuan")]
    public partial class RepBinhLuan
    {
        [Key]
        public int MaTraLoiBinhLuan { get; set; }
        public int MaBinhLuan { get; set; }
       
        [StringLength(50)]
        public string TenNguoiBinhLuan { get; set; }

        public DateTime? NgayBinhLuan { get; set; }

        public string NoiDung { get; set; }
        public int? Like { get; set; }

        public int? DisLike { get; set; }

    }
}
