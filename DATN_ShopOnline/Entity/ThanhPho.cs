namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ThanhPho")]
    public partial class ThanhPho
    {
        [Key]
        public int MaThanhPho { get; set; }

        [StringLength(50)]
        public string TinhOrThanh { get; set; }

        [StringLength(100)]
        public string TenThanhPho { get; set; }
    }
}
