using System;
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
  public class ProductsController : Controller
  {
    public ApplicationDbContext Context { get; }
    public ProductsController(ApplicationDbContext context)
    {
      Context = context;
    }
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

    //Dont know if this is how you do the import part
    // Also I dont know how to input the cvs part into it. 
    [HttpPut("import")]
    public IActionResult PutProduct([FromBody] Product product)
    {
      return Ok();
    }
  }
}