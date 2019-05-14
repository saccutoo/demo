namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Menu")]
    public partial class Menu
    {
        [Key]
        public int MenuId { get; set; }
        public int GridId { get; set; }
        public int MaChucVu { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public int Order { get; set; }
        public bool Status { get; set; }


    }
}
