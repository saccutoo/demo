namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("NhaCungCap")]
    public partial class NhaCungCap
    {
        [Key]
        public int MaNCC { get; set; }

        [StringLength(100)]
        public string TenNCC { get; set; }

        public int? SDT { get; set; }

        [StringLength(100)]
        public string DiaChi { get; set; }

        [StringLength(100)]
        public string Gmail { get; set; }

        [StringLength(100)]
        public string WebSite { get; set; }

        public bool? TrangThai { get; set; }
    }
}
