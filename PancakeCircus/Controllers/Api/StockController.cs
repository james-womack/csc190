using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PancakeCircus.Models.SQL;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers.Api
{
    [Route("api/[controller]")]
    public class StockController : Controller
    {
        [HttpGet("current/{page}")]
        public IActionResult GetStock(int page) {
            return Json(new List<Stock>());
        }
        [HttpGet("vendor/{vendorId}")]
        public IActionResult GetStock(int vendorId)
        {
            bool notFound = false;
            if (notFound )
            {
                return NotFound();
            }
            return Json(new List<Vendor>());
        }
        [HttpGet("item/{itemId}")]
        public IActionResult GetStock(int itemId)
        {
            bool notfound = false;
            if (notfound)
            {
                return NotFound();
            }
            return Json(new List<Stock>());
        }
        [HttpGet]
        public IActionResult GetStock([FromBody]Stock stock)
        {
            return Json(new List<Stock>());
        }
        [HttpPatch]
        public IActionResult PatchStock([FromBody]Stock stock)
        {
            return Ok();
        }
    }
}
