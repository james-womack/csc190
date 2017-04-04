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
    public class OrdersController : Controller
    {
        // Not done
        [HttpPost("new")]
        public IActionResult PostOrders([FromBody]OrderItem order)
        {
            return Json(new List<OrderItem>());
        }
        [HttpGet("copy/{itemId}")]
        public IActionResult GetOrder(string itemId)
        {
            bool notfound = false;
            if (notfound)
            {
                return NotFound();
            }
            return Ok();
        }
        [HttpGet("accept/{orderId}")]
        public IActionResult GetAcceptOrder(string orderId)
        {
            bool notfound = false;
            if (notfound)
            {
                return NotFound();
            }
            return Ok();
        }
        [HttpGet("deny/{orderId}")]
        public IActionResult GetDenyOrder(string orderId)
        {
            bool notfound = false;
            if (notfound)
            {
                return NotFound();
            }
            return Ok();
        }
    }
    }
