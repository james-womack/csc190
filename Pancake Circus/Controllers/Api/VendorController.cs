using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PancakeCircus.Data;
using PancakeCircus.Models.Client;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers.Api
{
    [Route("api/[controller]")]
    public class VendorController : Controller
    {
        public ApplicationDbContext Context { get; }
        public VendorController(ApplicationDbContext context)
        {
            Context = context;
        }
        // GET: api/values
        [HttpGet]
        public IActionResult GetVendors()
        {
            var vendors = Context.Vendors.ToList().Select(x=> new ClientVendor(x));
            return Json(vendors);
        }
    }
}
