using System;
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
  public class OrdersController : Controller
  {
    // TODO: Change to import from file
    private const double SafetyFactor = 2.0;
    public ApplicationDbContext Context { get; }

    public OrdersController(ApplicationDbContext context)
    {
      Context = context;
    }

    // Not done
    [HttpGet("generate")]
    public IActionResult GenerateNewOrder()
    {
      // Get the last two accepted orders, in the form of 
      // OrderItems total amount grouped by item id
      var lastTwoOrders = Context.Orders
        .Include(x => x.OrderItems)
        .Where(x => x.Status == OrderStatus.Approved)
        .OrderByDescending(x => x.OrderDate)
        .Take(2)
        .SelectMany(x => x.OrderItems)
        .GroupBy(x => x.ItemId, x => x.TotalAmount)
        .Select(x => new { ItemId = x.Key, Average = x.Average() })
        .ToList();
      
      // Get the stock items
      var stockItems = Context.Stocks
        .Include(x => x.Item)
        .Select(x => x.Item)
        .ToList();
      var needsForEachItem = stockItems.ToDictionary(x => x.ItemId, x => x.MinimumAmount * SafetyFactor);
      var itemsNeeded = stockItems.Select(x => x.ItemId).ToList();
      
      // Factor in last two accepted orders if there is any
      if (lastTwoOrders.Count > 0)
      {
        foreach (var grp in lastTwoOrders)
        {
          // Keep at least safety factor, otherwise factor in
          if (needsForEachItem.ContainsKey(grp.ItemId))
          {
            var avg = (needsForEachItem[grp.ItemId] + grp.Average) / 2;
            needsForEachItem[grp.ItemId] = Math.Max(needsForEachItem[grp.ItemId], avg);
          }
        }
      }

      // Get all of the products contained in the itemsNeeded,
      // And group them by itemId, sort each group by price per unit
      var availableProducts = Context.Products
        .Where(x => itemsNeeded.Contains(x.ItemId))
        .ToList();
      var cheapestProduct = availableProducts.GroupBy(x => x.ItemId)
        .Select(x => new { ItemId = x.Key, Products = x.OrderBy(p => Math.Abs(p.PackageAmount) > .001 ? p.Price / p.PackageAmount : p.Price).ToList() })
        .ToDictionary(x => x.ItemId, x => x.Products);
      var vendorProducts = from prod in availableProducts
        group prod by prod.VendorId
        into vendorProds
        let vendorItems = vendorProds.Select(x => x.ItemId).ToList()
        select vendorProds;
                           
      // Get all of the vendors price for orders
      return Json(new List<OrderItem>());
    }

    [HttpGet("copy/{itemId}")]
    public IActionResult GetOrder(string itemId)
    {
      var notfound = false;
      if (notfound)
        return NotFound();
      return Ok();
    }

    [HttpGet("accept/{orderId}")]
    public IActionResult GetAcceptOrder(string orderId)
    {
      var notfound = false;
      if (notfound)
        return NotFound();
      return Ok();
    }

    [HttpGet("deny/{orderId}")]
    public IActionResult GetDenyOrder(string orderId)
    {
      var notfound = false;
      if (notfound)
        return NotFound();
      return Ok();
    }

    [HttpGet]
    public IActionResult GetOrders()
    {
      return Json(Context.Orders.ToList().Select(x => new ClientOrder(x, false)));
    }
  }
}
