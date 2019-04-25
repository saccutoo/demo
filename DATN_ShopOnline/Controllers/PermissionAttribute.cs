using System;

using DATN_ShopOnline.Entity;
namespace DATN_ShopOnline.Controllers
{
    public class PermissionAttribute : Attribute
    {
        public int TableID { set; get; }
        public int TypeAction { set; get; }
    }
}