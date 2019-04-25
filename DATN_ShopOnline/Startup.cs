using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DATN_ShopOnline.Startup))]
namespace DATN_ShopOnline
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
