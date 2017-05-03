using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using PancakeCircus.Data;
using PancakeCircus.Models.Client;
using PancakeCircus.Models.SQL;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers.Api
{
  [Route("api/[controller]")]
  public class OrdersController : Controller
  {
    public ApplicationDbContext Context { get; }

    public OrdersController(ApplicationDbContext context)
    {
      Context = context;
    }
    // Not done
    [HttpPost("new")]
    public IActionResult PostOrders([FromBody] OrderItem order)
    {
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
