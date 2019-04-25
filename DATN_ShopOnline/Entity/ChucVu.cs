namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ChucVu")]
    public partial class ChucVu
    {
        [Key]
        public int MaChucVu { get; set; }

        [StringLength(50)]
        public string TenChucVu { get; set; }
    }
}
