namespace DATN_ShopOnline.Entity
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class ShopOnline : DbContext
    {
        public ShopOnline()
            : base("name=ShopOnline")
        {
        }

        public virtual DbSet<BinhLuan> BinhLuans { get; set; }
        public virtual DbSet<ChiTietDonBan> ChiTietDonBans { get; set; }
        public virtual DbSet<ChiTietDonNhap> ChiTietDonNhaps { get; set; }
        public virtual DbSet<ChucVu> ChucVus { get; set; }
        public virtual DbSet<DonBan> DonBans { get; set; }
        public virtual DbSet<DonNhap> DonNhaps { get; set; }
        public virtual DbSet<Huyen> Huyens { get; set; }
        public virtual DbSet<KhachHang> KhachHangs { get; set; }
        public virtual DbSet<LoaiSanPham> LoaiSanPhams { get; set; }
        public virtual DbSet<MoTaSanPham> MoTaSanPhams { get; set; }
        public virtual DbSet<NhaCungCap> NhaCungCaps { get; set; }
        public virtual DbSet<NhanVien> NhanViens { get; set; }
        public virtual DbSet<SanPham> SanPhams { get; set; }
        public virtual DbSet<Slide> Slides { get; set; }
        public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }
        public virtual DbSet<ThanhPho> ThanhPhos { get; set; }
        public virtual DbSet<TuongTac> TuongTacs { get; set; }
        public virtual DbSet<RepBinhLuan> RepBinhLuans { get; set; }
        public virtual DbSet<Action> Actions { get; set; }
        public virtual DbSet<Grid> Grids { get; set; }
        public virtual DbSet<Menu> Menu { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BinhLuan>()
                .Property(e => e.NoiDung)
                .IsFixedLength();

            modelBuilder.Entity<NhanVien>()
                .Property(e => e.GioiTinh)
                .IsFixedLength();
        }
    }
}
