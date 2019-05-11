using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using DATN_ShopOnline.Entity;
using System.Data;
using System.Data.Entity;
using System.Threading.Tasks;
using System.IO;
using System.Web.Hosting;
using DATN_ShopOnline.Class;
using System.Net.Mail;
using System.Net;
using System.Globalization;
using System.Net.Mime;

namespace DATN_ShopOnline.Controllers
{
    public class BaseAdminController : Controller
    {
        // GET: BaseAdmin
        private ShopOnline db = new ShopOnline();
        private Messenger messenger = new Messenger();
        public bool Permission(string Controller, string Action)
        {
            if (Session["TaiKhoan1"] != null)
            {
                var TaiKhoan = Session["TaiKhoan1"].ToString();
                var resultNV = db.NhanViens.Single(s => s.TaiKhoan.Contains(TaiKhoan));
                try
                {
                    var resultAction = db.Actions.Single(s => s.Controller == Controller && s.MaNV == resultNV.MaNV);
                    if (Action == "Index")
                    {
                        if (resultAction.isIndex == true) return true;
                        else return false;
                    }
                    else if (Action == "Get")
                    {
                        if (resultAction.isGet == true) return true;
                        else return false;
                    }
                    else if (Action == "Add")
                    {
                        if (resultAction.isAdd == true) return true;
                        else return false;
                    }
                    else if (Action == "Edit")
                    {
                        if (resultAction.isEdit == true) return true;
                        else return false;
                    }
                    if (Action == "Delete")
                    {
                        if (resultAction.isDelete == true) return true;
                        else return false;
                    }
                    else if (Action == "Submit")
                    {
                        if (resultAction.isSubmit == true) return true;
                        else return false;
                    }
                    else if (Action == "ExportExcel")
                    {
                        if (resultAction.isExportExcel == true) return true;
                        else return false;
                    }
                    else if (Action == "ImportExecel")
                    {
                        if (resultAction.isImportExcel == true) return true;
                        else return false;
                    }
                    else
                    {
                        return false;

                    }
                }
                catch (Exception)
                {

                    return false;
                }

            }
            else
            {
                return false;
            }
        }
        public Messenger SendMail(string body, string ToMail)
        {
            try
            {
                MailMessage message = new MailMessage(new MailAddress("kimlam2207@gmail.com", "RuouPlaza.com"), new MailAddress(ToMail));
                message.Subject = "Thông tin đơn hàng từ RuouPlaza.com";
                message.IsBodyHtml = true;
                message.Body = body;
                SmtpClient smtp = new SmtpClient();
                smtp.UseDefaultCredentials = false;
                smtp.Host = "smtp.gmail.com"; //Or Your SMTP Server Address                  
                smtp.Credentials = new NetworkCredential("kimlam2207@gmail.com", "tranlam123");
                //client.UseDefaultCredentials = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.EnableSsl = true;
                smtp.Port = 587;

                smtp.Send(message);
                messenger.IsSuccess = true;
                return messenger;
            }
            catch (Exception e)
            {
                messenger.IsSuccess = false;
                return messenger;
            }
        }

    }
}