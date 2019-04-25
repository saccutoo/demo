namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Action")]
    public partial class Action
    {
        [Key]
        public int AutoID { get; set; }
        public int? MaNV { get; set; }
        public string Controller { get; set; } 
        public bool isIndex { get; set; }
        public bool isGet { get; set; }
        public bool isAdd { get; set; }
        public bool isEdit { get; set; }
        public bool isDelete { get; set; }
        public bool isSubmit { get; set; }
        public bool isExportExcel { get; set; }
        public bool isImportExcel { get; set; }

    }
}
