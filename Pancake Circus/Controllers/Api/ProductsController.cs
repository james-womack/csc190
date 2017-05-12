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
    public IActionResult AddProduct([FromBody] List<AddProductRequest> products)
    {
      // Find Items and Vendors related to requests
      var itemIds = products.Select(x => x.ItemId).ToList();
      var vendorIds = products.Select(x => x.VendorId).ToList();
      var dbItems = Context.Items.Where(x => itemIds.Contains(x.ItemId)).ToDictionary(x => x.ItemId, x => x);
      var dbVendors = Context.Vendors.Where(x => vendorIds.Contains(x.VendorId)).ToDictionary(x => x.VendorId, x => x);

      // Make sure they are of same length
      if (dbItems.Count != itemIds.Count || dbVendors.Count != vendorIds.Count)
      {
        return BadRequest("Invalid Product Add Requests: No item/vendor found in list");
      }

      foreach (var prod in products)
      {
        Context.Products.Add(new Product()
        {
          Item = dbItems[prod.ItemId],
          Vendor = dbVendors[prod.VendorId],
          PackageAmount = prod.PackageAmount,
          Price = prod.Price,
          SKU = prod.SKU
        });
      }
      Context.SaveChanges();

      return Ok();
    }

    [HttpPatch]
    public IActionResult PatchProduct([FromBody] List<PatchProductRequest> product)
    {
      // Slow get...
      foreach (var req in product)
      {
        var dbProd = Context.Products.FirstOrDefault(x => x.ItemId == req.ItemId && x.VendorId == req.VendorId);
        if (dbProd == null)
        {
          return BadRequest($"Product not found: {req.ItemId} {req.VendorId}");
        }

        dbProd.PackageAmount = req.PackageAmount;
        dbProd.Price = req.Price;
        dbProd.SKU = req.SKU;
        Context.Products.Update(dbProd);
      }
      Context.SaveChanges();

      return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteProduct([FromBody]List<DeleteProductRequest> reqs)
    {
      var dbProd = reqs
        .Select(x => Context.Products.FirstOrDefault(y => y.VendorId == x.VendorId && y.ItemId == x.ItemId))
        .Where(x => x != null)
        .ToList();
      if (reqs.Count != dbProd.Count)
      {
        // We didnt find all products specified in the request
        return NotFound($"Couldn't find all {reqs.Count} products in the request.");
      }

      Context.Products.RemoveRange(dbProd);
      Context.SaveChanges();
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

    [HttpGet]
    public IActionResult GetAllProducts()
    {
      var products = Context.Products.Include(p => p.Item).Include(p => p.Vendor).ToList().Select(p => new ClientProduct(p, p.Item, p.Vendor));
      return Json(products);
    }

    //Dont know if this is how you do the import part
    // Also I dont know how to input the cvs part into it. 
    [HttpPut("import")]
    public IActionResult PutProducts([FromBody] Product product)
    {
      return Ok();
    }
  }
}
