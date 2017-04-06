using Microsoft.AspNetCore.Mvc;

namespace PancakeCircus.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
