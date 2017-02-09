using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PancakeCircus.Models.SQL;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers
{
    [Route("[controller]")]
    public class VendorController : Controller
    {
        private readonly PancakeContext _context;
        public VendorController(PancakeContext context)
        {
            _context = context;
        }

        [HttpGet]
        // GET: /<controller>/
        public IActionResult Index()
        {
            var vendorsFromSac = _context.Vendors.Where(x => x.City == "Sacramento");
            return View();
        }
        [HttpGet("Edit")]
        public IActionResult Edit()
        {
            var testvendor = new Vendor {
                Name = "Costco",
                StreetAddress = "3437 Pancakey Way",
                City = "Sacramento",
                ZipCode = "49382",
                Phone = "666 666 4269",
                State = "CA"
            };
            _context.Vendors.Add(testvendor);
            _context.SaveChanges();
            return View();
        }
    }
     
}
