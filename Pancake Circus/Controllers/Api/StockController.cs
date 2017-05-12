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

    [HttpGet]
    public IActionResult GetStock()
    {
      var stocks = Context.Stocks.Include(x => x.Item).Include(x => x.Vendor).ToList().Select(s => new ClientStock(s));
      return Json(stocks);
    }

    [HttpPut]
    public IActionResult PutStock([FromBody] List<AddStockRequest> stocks)
    {
      // Find Items and Vendors related to requests
      var itemIds = stocks.Select(x => x.ItemId).ToList();
      var vendorIds = stocks.Select(x => x.VendorId).ToList();
      var dbItems = Context.Items.Where(x => itemIds.Contains(x.ItemId)).ToDictionary(x => x.ItemId, x => x);
      var dbVendors = Context.Vendors.Where(x => vendorIds.Contains(x.VendorId)).ToDictionary(x => x.VendorId, x => x);

      // Make sure they are of same length
      if (dbItems.Count != itemIds.Count || dbVendors.Count != vendorIds.Count)
      {
        return BadRequest("Invalid Stock Add Requests: No item/vendor found in list");
      }

      foreach (var stock in stocks)
      {
        Context.Stocks.Add(new Stock()
        {
          Item = dbItems[stock.ItemId],
          Vendor = dbVendors[stock.VendorId],
          Amount = stock.Amount,
          Location = stock.Location
        });
      }
      Context.SaveChanges();

      return Ok();
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
