using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers
{
    [Route("[controller]")]
    public class OrdersController : Controller
    {
        [HttpGet]
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("Generate")]
        public IActionResult Generate()
        {

            return View();
        }
        [HttpGet("Details")]
        public IActionResult Details()
        {

            return View();
        }
    }
}
