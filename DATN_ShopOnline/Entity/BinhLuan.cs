namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("BinhLuan")]
    public partial class BinhLuan
    {
        [Key]
        public int MaBinhLuan { get; set; }

        public int? MaSP { get; set; }

        [StringLength(50)]
        public string TenNguoiBinhLuan { get; set; }

        [StringLength(100)]
        public string Gmail { get; set; }

        public DateTime? NgayBinhLuan { get; set; }

        [StringLength(500)]
        public string NoiDung { get; set; }
        public int? Like { get; set; }

        public int? DisLike { get; set; }

        public int? TrangThai { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RepBinhLuan> RepBinhLuan { get; set; }
    }
}
