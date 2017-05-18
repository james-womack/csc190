using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
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
    public ILogger Logger { get; }

    public OrdersController(ApplicationDbContext context, ILoggerFactory factory)
    {
      Context = context;
      Logger = factory.CreateLogger(typeof(OrdersController));
    }

    // Not done
    [HttpPost("generate")]
    public IActionResult GenerateNewOrder([FromBody]GenerateOrderRequest req)
    {
      // Get the last two accepted orders, in the form of 
      // OrderItems total amount grouped by item id
      var lastTwoOrders = Context.Orders
        .Include(x => x.OrderItems)
        .Where(x => x.Status == OrderStatus.Approved)
        .OrderByDescending(x => x.OrderDate)
        .ToList()
        .Take(2)
        .SelectMany(x => x.OrderItems)
        .GroupBy(x => x.ItemId, x => x.TotalAmount)
        .Select(x => new { ItemId = x.Key, Average = x.Average() })
        .ToList();
      
      // Get the stock items
      var stockItems = Context.Stocks
        .Include(x => x.Item)
        .Select(x => x.Item)
        .Distinct((i1, i2) => i1.ItemId == i2.ItemId)
        .ToList();
      var needsForEachItem = stockItems.ToDictionary(x => x.ItemId, x => x.MinimumAmount * req.SafetyFactor);
      var itemsNeeded = stockItems.Select(x => x.ItemId).ToList();
      var itemsDict = stockItems.ToDictionary(x => x.ItemId);
      
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

      // Create new order
      var order = new Order()
      {
        OrderDate = DateTime.Now,
        OrderItems = new List<OrderItem>(),
        Status = OrderStatus.None
      };
      Context.Orders.Add(order);
      Context.SaveChanges();

      // Get all of the products contained in the itemsNeeded,
      // And group them by itemId, sort each group by price per unit
      var availableProducts = Context.Products
        .Where(x => itemsNeeded.Contains(x.ItemId))
        .ToList();
      if (!string.IsNullOrWhiteSpace(req.PerferredVendorId))
      {
        // Get that vendor
        var prefVendor = Context.Vendors
          .Include(x => x.Products)
          .FirstOrDefault(x => x.VendorId == req.PerferredVendorId);
        var gottenItems = new List<string>();

        if (prefVendor == null)
        {
          return BadRequest($"Vendor {req.PerferredVendorId} not found");
        }

        // Turn product list into dict
        var vendorProductDict = prefVendor.Products.ToDictionary(x => x.ItemId);

        // Go through items needed and pull from vendor product dict
        foreach (var item in itemsNeeded)
        {
          if (vendorProductDict.ContainsKey(item))
          {
            var prod = vendorProductDict[item];
            var orderAmount = (int) Math.Ceiling(needsForEachItem[item] / prod.PackageAmount);
            var totalAmount = (int)(orderAmount * prod.PackageAmount);
            var price = orderAmount * prod.Price;

            order.OrderItems.Add(new OrderItem()
            {
              Item = itemsDict[item],
              Order = order,
              Vendor = prefVendor,
              PaidPrice = price,
              OrderAmount = orderAmount,
              TotalAmount = totalAmount
            });
            gottenItems.Add(item);
          }
        }

        // Remove needs now
        itemsNeeded.RemoveAll(x => gottenItems.Contains(x));
      }
      var cheapestProduct = GetCheapestProducts();

      // Fill in cheapest product now
      foreach (var item in itemsNeeded)
      {
        try
        {
          var prod = cheapestProduct[item][0];
          var orderAmount = (int)Math.Ceiling(needsForEachItem[item] / prod.PackageAmount);
          var totalAmount = (int)(orderAmount * prod.PackageAmount);
          var price = orderAmount * prod.Price;

          order.OrderItems.Add(new OrderItem()
          {
            Item = itemsDict[item],
            Order = order,
            Vendor = prod.Vendor,
            PaidPrice = price,
            OrderAmount = orderAmount,
            TotalAmount = totalAmount
          });
        }
        catch (Exception e)
        {
          Logger.LogDebug($"Failed to find product for item id {item}, e: {e}");
        }
      }

      // Save the order now
      Context.Orders.Update(order);
      Context.SaveChanges();
                           
      // Get all of the vendors price for orders
      return Json(new ClientOrder(order, false));
    }

    [HttpGet("copy/{orderId}")]
    public IActionResult CopyOrder(string orderId)
    {
      var order = Context.Orders.Include(x => x.OrderItems).FirstOrDefault(x => x.OrderId == orderId);
      if (order == null)
      {
        return NotFound($"Order {orderId} not found");
      }

      var newOrder = new Order()
      {
        OrderDate = DateTime.Now,
        OrderItems = new List<OrderItem>(),
        Status = OrderStatus.None
      };

      // Add to database for now and save to get id
      Context.Orders.Add(newOrder);
      Context.SaveChanges();

      // Get the Cheapest products just incase the old products dont exist
      var cheapest = GetCheapestProducts();

      // Now get products associated with old order and fill in from cheepest if needed
      foreach (var oldOi in order.OrderItems)
      {
        // See if the product exists
        var existProduct =
          Context.Products
            .Include(x => x.Vendor)
            .Include(x => x.Item)
            .FirstOrDefault(x => x.ItemId == oldOi.ItemId && x.VendorId == oldOi.VendorId);

        if (existProduct == null)
        {
          try
          {
            // Grab the cheapest product
            existProduct = cheapest[oldOi.ItemId][0];
          }
          catch (Exception e)
          {
            Logger.LogDebug($"Could not find existing product for: I: {oldOi.ItemId} V: {oldOi.VendorId} Error: {e}");
            continue;
          }
        }

        // Add old total amount back in
        var newOrderAmount = (int) Math.Ceiling(oldOi.TotalAmount/existProduct.PackageAmount);
        var newTotal = (int) (existProduct.PackageAmount * newOrderAmount);
        var newPrice = existProduct.Price * newOrderAmount;
        var newOrderItem = new OrderItem()
        {
          Item = existProduct.Item,
          Vendor = existProduct.Vendor,
          Order = newOrder,
          PaidPrice = newPrice,
          TotalAmount = newTotal,
          OrderAmount = newOrderAmount
        };

        // Add new order item
        newOrder.OrderItems.Add(newOrderItem);
      }

      // Save them changes
      Context.Orders.Update(newOrder);
      Context.SaveChanges();
      return Json(new ClientOrder(newOrder, false));
    }

    private Dictionary<string, List<Product>> GetCheapestProducts()
    {
      var grps = Context.Products
        .Include(x => x.Item)
        .Include(x => x.Vendor)
        .GroupBy(x => x.ItemId)
        .ToDictionary(x => x.Key, x => x.Select(y => y).OrderBy(y => y.Price / y.PackageAmount).ToList());

      return grps;
    }

    [HttpGet("status/{orderId}/{newStatus}")]
    public IActionResult ChangeOrderStatus(string orderId, int newStatus)
    {
      if (!Enum.IsDefined(typeof(OrderStatus), newStatus))
      {
        return BadRequest("Invalid order status");
      }

      var order = Context.Orders.FirstOrDefault(x => x.OrderId == orderId);
      if (order == null)
      {
        return NotFound($"Order {orderId} not found");
      }

      // Now update order status
      var status = (OrderStatus) newStatus;
      order.Status = status;
      Context.Orders.Update(order);
      Context.SaveChanges();

      // Update stock if change is to fullfilled

      return Ok();
    }

    [HttpGet]
    public IActionResult GetOrders()
    {
      return Json(Context.Orders.Include(x => x.OrderItems).ToList().Select(x => new ClientOrder(x, false)));
    }

    [HttpPut("items")]
    public IActionResult PutOrderItems([FromBody] List<AddOrderItemRequest> orderItems)
    {
      if (orderItems.Count == 0)
      {
        return BadRequest("No order items given");
      }

      var first = orderItems.First();
      foreach (var orderItem in orderItems)
      {
        if (orderItem.OrderId != first.OrderId)
        {
          return BadRequest("Not all orderitems from same order");
        }
      }

      // Grab the order from the database, and map items to lists
      var dbOrder = Context.Orders.Include(x => x.OrderItems).FirstOrDefault(x => x.OrderId == first.OrderId);
      var itemIds = orderItems.Select(x => x.ItemId).ToList();
      var vendorIds = orderItems.Select(x => x.VendorId).ToList();

      // Grab items and vendors from db
      var itemDict = Context.Items.Where(x => itemIds.Contains(x.ItemId)).ToDictionary(x => x.ItemId);
      var vendorDict = Context.Vendors.Where(x => vendorIds.Contains(x.VendorId)).ToDictionary(x => x.VendorId);

      // Add order items to order and save
      foreach (var addRequest in orderItems)
      {
        try
        {
          dbOrder.OrderItems.Add(new OrderItem()
          {
            Item = itemDict[addRequest.ItemId],
            Vendor = vendorDict[addRequest.VendorId],
            Order = dbOrder,
            OrderAmount = addRequest.OrderAmount,
            PaidPrice = addRequest.PaidPrice,
            TotalAmount = addRequest.TotalAmount
          });
        }
        catch (Exception e)
        {
          // Item/Vendor doesnt exist
          return BadRequest($"Invalid order item passed in: {addRequest.ItemId} {addRequest.VendorId} {e.ToString()}");
        }
      }

      Context.SaveChanges();
      return Ok();
    }

    [HttpDelete("items")]
    public IActionResult DeleteOrderItems([FromBody]List<DeleteOrderItemRequest> orderItems)
    {
      // First make sure all the order items are from the same order
      if (orderItems.Count == 0)
      {
        return BadRequest("No order items given");
      }

      var first = orderItems.First();
      foreach (var orderItem in orderItems)
      {
        if (orderItem.OrderId != first.OrderId)
        {
          return BadRequest("Not all order items from same order");
        }
      }

      // Grab the order from the database, and all order items
      var order = Context.Orders.Include(x => x.OrderItems).FirstOrDefault(x => x.OrderId == first.OrderId);
      if (order == null)
      {
        return BadRequest($"Order {first.OrderId} doesn't exist");
      }

      // Now grab all of the order items to delete from that order
      foreach (var orderItem in orderItems)
      {
        // Check against other list
        foreach (var dbOrderItem in order.OrderItems)
        {
          if (dbOrderItem.ItemId == orderItem.ItemId && dbOrderItem.VendorId == orderItem.VendorId)
          {
            Context.OrderItems.Remove(dbOrderItem);
          }
        }
      }

      // Save changes
      Context.SaveChanges();
      return Ok();
    }

    [HttpPatch("items")]
    public IActionResult PatchOrderItems([FromBody] List<PatchOrderItemRequest> orderItems)
    {
      if (orderItems.Count == 0)
      {
        return BadRequest("No order items given");
      }

      var first = orderItems.First();
      foreach (var orderItem in orderItems)
      {
        if (orderItem.OrderId != first.OrderId)
        {
          return BadRequest("Not all orderitems from same order");
        }
        if (orderItem.OrderAmount < 1)
        {
          return BadRequest("Order Amount must be > 0");
        }
      }

      // Grab the order from the database, and map items to lists
      var dbOrder = Context.Orders.Include(x => x.OrderItems).FirstOrDefault(x => x.OrderId == first.OrderId);
      var orderItemsDict = dbOrder.OrderItems.ToDictionary(x => $"{x.ItemId} {x.VendorId}");

      // Update the order items
      foreach (var req in orderItems)
      {
        try
        {
          var dbOi = orderItemsDict[$"{req.ItemId} {req.VendorId}"];
          dbOi.OrderAmount = req.OrderAmount;
          dbOi.PaidPrice = req.PaidPrice;
          dbOi.TotalAmount = req.TotalAmount;
          Context.OrderItems.Update(dbOi);
        }
        catch (Exception e)
        {
          return BadRequest($"No OrderItem found: {req.ItemId} {req.VendorId} {req.OrderId} {e}");
        }
      }

      Context.SaveChanges();
      return Ok();
    }

    [HttpGet("{id}")]
    public IActionResult GetOrder(string id)
    {
      var order = Context.Orders.FirstOrDefault(x => x.OrderId == id);
      if (order == null)
      {
        return NotFound($"Order {id} not found");
      }

      // Get all of the order items now
      var orderItems = Context.OrderItems.Include(x => x.Item)
        .Include(x => x.Vendor)
        .Include(x => x.Order)
        .Where(x => x.OrderId == id)
        .ToList()
        .Select(x => new ClientOrderItem(x))
        .ToList();

      return Json(orderItems);
    }

    [HttpDelete]
    public IActionResult DeleteOrders([FromBody]List<string> orderIds)
    {
      var ordersToDel = Context.Orders.Where(x => orderIds.Contains(x.OrderId)).ToList();
      if (orderIds.Count != ordersToDel.Count)
      {
        return BadRequest("Some orders were not in the DB");
      }

      Context.Orders.RemoveRange(ordersToDel);
      Context.SaveChanges();

      return Ok();
    }
  }
}
