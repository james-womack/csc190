using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PancakeCircus.Data;
using PancakeCircus.Models.Client;
using PancakeCircus.Models.SQL;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers.Api
{
  [Route("api/[controller]")]
  public class ProductsController : Controller
  {
    public ProductsController(ApplicationDbContext context, ILoggerFactory factory)
    {
      Context = context;
      Logger = factory.CreateLogger(typeof(ProductsController));
    }

    public ApplicationDbContext Context { get; }
    public ILogger Logger { get; }

    [HttpPut]
    public IActionResult AddProduct([FromBody] Product product)
    {
      return Ok();
    }

    [HttpPatch]
    public IActionResult PatchProduct([FromBody] Product product)
    {
      return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteProduct([FromBody] Product product)
    {
      var notFound = false;
      if (notFound) return NotFound();
      return Ok();
    }

    [HttpGet("{id}")]
    public IActionResult GetProducts([FromQuery] string id)
    {
      Console.WriteLine("Getting Products for a vendor");
      var vendor = Context.Vendors.FirstOrDefault(x => x.VendorId == id);
      if (vendor == null)
        return NotFound($"Vendor of id: {id} is not found");

      var vendorProducts = from prod in Context.Products
        where prod.VendorId == id
        join item in Context.Items on prod.ItemId equals item.ItemId
        select new ClientProduct(prod, item, vendor);

      return Json(vendorProducts);
    }

    [HttpPost("fromVendors")]
    public IActionResult GetAllProducts([FromBody] List<string> vendors)
    {
      var products = Context.Vendors.Include(x => x.Products)
        .ThenInclude(x => x.Item)
        .Include(x => x.Products)
        .ThenInclude(x => x.Vendor)
        .Where(x => vendors.Contains(x.VendorId))
        .ToList()
        .SelectMany(x => x.Products)
        .Select(x => new ClientProduct(x, x.Item, x.Vendor))
        .ToList();

      Logger.LogInformation($"Number of products: {products.Count}");
      return Json(products);
    }

    //Dont know if this is how you do the import part
    // Also I dont know how to input the cvs part into it. 
    [HttpPut("import")]
    public IActionResult PutProduct([FromBody] Product product)
    {
      return Ok();
    }
  }
}
