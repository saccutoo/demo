namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Grid")]
    public partial class Grid
    {
        [Key]
        public int GridId { get; set; }
        public int MaChucVu { get; set; }
        public string Name { get; set; }

        public string icon { get; set; }
        public string link { get; set; }
        public int Order { get; set; }
        public bool Status { get; set; }

    }
}
