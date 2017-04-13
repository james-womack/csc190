using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PancakeCircus.Data;
using PancakeCircus.Models.Client;
using PancakeCircus.Models.SQL;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers.Api
{
    [Route("api/[controller]")]
    public class StockController : Controller
    {
        public ApplicationDbContext Context { get; }
        public StockController(ApplicationDbContext context)
        {
            Context = context;
        }
        [HttpGet("current/{page}")]
        public IActionResult GetStock(int page) {
            return Json(new List<Stock>());
        }
        [HttpGet("vendor/{vendorId}")]
        public IActionResult GetStock(string vendorId)
        {
            bool notFound = false;
            if (notFound )
            {
                return NotFound();
            }
            return Json(new List<Stock>());
        }
        [HttpGet("item/{itemId}")]
        public IActionResult GetItemStock(string itemId)
        {
            bool notfound = false;
            if (notfound)
            {
                return NotFound();
            }
            return Json(new List<Stock>());
        }
        [HttpGet("low")]
        public IActionResult GetLowStock()
        {
            return Json(new List<Stock>());
        }
        [HttpGet]
        public IActionResult GetStock()
        {
            var stocks = Context.Stocks.Include(x => x.Item).Include(x => x.Vendor).ToList().Select(s => new ClientStock(s));
            return Json(stocks);
        }
        [HttpPatch]
        public IActionResult PatchStock([FromBody]Stock stock)
        {
            return Ok();
        }
    }
}
