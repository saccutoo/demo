namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("NhanVien")]
    public partial class NhanVien
    {
        [Key]
        public int MaNV { get; set; }

        [StringLength(50)]
        public string TenNV { get; set; }

        [StringLength(3)]
        public string GioiTinh { get; set; }

        [Column(TypeName = "date")]
        public DateTime? NgaySinh { get; set; }

        [StringLength(100)]
        public string QueQuan { get; set; }

        public Int32? SDT { get; set; }

        [StringLength(100)]
        public string Gmail { get; set; }

        [StringLength(100)]
        public string AnhDaiDien { get; set; }

        public int? MaChucVu { get; set; }

        [StringLength(50)]
        public string TaiKhoan { get; set; }
        // khóa chính nằm trong bảng chi tiết đơn hàng
        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        //public virtual ICollection<CHITIETDONNHAP> CHITIETDONNHAPs { get; set; }

        //khóa chính chức vụ là khóa ngoại trong bảng nhân viên
        public virtual ChucVu CHUCVU { get; set; }
    }
}
