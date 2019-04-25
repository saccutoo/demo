namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Huyen")]
    public partial class Huyen
    {
        [Key]
        public int MaHuyen { get; set; }

        public int? MaThanhPho { get; set; }

        [StringLength(100)]
        public string TenHuyen { get; set; }
    }
}
