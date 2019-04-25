namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SanPham")]
    public partial class SanPham
    {
        [Key]
        public int MaSP { get; set; }

        public int? MaNCC { get; set; }

        public int? MaLoai { get; set; }

        [StringLength(100)]
        public string TenSP { get; set; }

        public int? SoLuong { get; set; }

        [StringLength(200)]
        public string HinhAnh { get; set; }

        public double? GiaNhap { get; set; }

        public double? GiaBan { get; set; }

        public int? SoLuongDaBan { get; set; }

        public int? HeSo { get; set; }

        public string NeworOld { get; set; }
        public string ImgNeworOld { get; set; }
        public bool? TrangThai { get; set; }


        // khóa chính sản phẩm nằm trong bảng mô tả sản phẩm
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MoTaSanPham> MOTASANPHAM { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BinhLuan> BINHLUAN { get; set; }

        //khóa chính chức vụ nằm trong bảng sản phẩm
        public virtual LoaiSanPham LOAISP { get; set; }
        public virtual NhaCungCap NHACC { get; set; }

    }
}
