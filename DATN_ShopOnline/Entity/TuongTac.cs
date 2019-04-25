namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TuongTac")]
    public partial class TuongTac
    {
        [Key]
        public int MaTuongTac { get; set; }

        public int? MaSP { get; set; }

        public int? View { get; set; }

        public int? Like { get; set; }

        public int? Share { get; set; }

        public int? Heart { get; set; }
    }
}
