using System.Collections.Generic;
using System.Linq;
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
    public StockController(ApplicationDbContext context)
    {
      Context = context;
    }

    public ApplicationDbContext Context { get; }

    [HttpGet("current/{page}")]
    public IActionResult GetStock(int page)
    {
      return Json(new List<Stock>());
    }

    [HttpGet("vendor/{vendorId}")]
    public IActionResult GetStock(string vendorId)
    {
      var notFound = false;
      if (notFound)
        return NotFound();
      return Json(new List<Stock>());
    }

    [HttpGet("item/{itemId}")]
    public IActionResult GetItemStock(string itemId)
    {
      var notfound = false;
      if (notfound)
        return NotFound();
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
    public IActionResult PatchStock([FromBody] List<PatchStockRequest> stock)
    {
      var changes = stock.ToDictionary(k => k.ItemId + k.VendorId, e => new {e.Amount, e.Location});
      var itemids = new List<string>();
      var vendorids = new List<string>();
      foreach (var s in stock)
      {
        itemids.Add(s.ItemId);
        vendorids.Add(s.VendorId);
      }

      var dbstocks = Context.Stocks.Where(x => itemids.Contains(x.ItemId) && vendorids.Contains(x.VendorId)).ToList();
      foreach (var s in dbstocks)
      {
        s.Amount = changes[s.ItemId + s.VendorId].Amount;
        s.Location = changes[s.ItemId + s.VendorId].Location;
      }
      Context.UpdateRange(dbstocks);
      Context.SaveChanges();
      return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteStock([FromBody] List<DeleteStockRequest> stockToDelete)
    {
      var itemIds = stockToDelete.Select(x => x.ItemId).ToList();
      var vendorIds = stockToDelete.Select(x => x.VendorId).ToList();

      // Delete all of the stocks in the request
      var stocks = Context.Stocks.Where(x => itemIds.Contains(x.ItemId) && vendorIds.Contains(x.VendorId));
      Context.Stocks.RemoveRange(stocks);
      Context.SaveChanges();

      return Ok();
    }
  }
}
