using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DATN_ShopOnline.Class
{
    public class Messenger
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public bool RedirectToAction { get; set; }

    }
}