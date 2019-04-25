namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("MoTaSanPham")]
    public partial class MoTaSanPham
    {
        [Key]
        public int MaMTSP { get; set; }

        public int? MaSP { get; set; }

        [StringLength(1000)]
        public string GioiThieu1 { get; set; }
        [StringLength(50)]
        public string ChungLoai { get; set; }
        [StringLength(50)]
        public string GiongNho { get; set; }

        [StringLength(20)]
        public string DoCon { get; set; }

        [StringLength(20)]
        public string DungTich { get; set; }

        [StringLength(50)]
        public string XuatXu { get; set; }

        [StringLength(100)]
        public string HinhAnh1 { get; set; }

        [StringLength(100)]
        public string HinhAnh2 { get; set; }

        public string GioiThieu2 { get; set; }
    }
}
