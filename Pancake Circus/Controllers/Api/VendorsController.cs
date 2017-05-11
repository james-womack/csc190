using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PancakeCircus.Data;
using PancakeCircus.Models.Client;
using PancakeCircus.Models.SQL;

namespace PancakeCircus.Controllers.Api
{
  [Produces("application/json")]
  [Route("api/[controller]")]
  public class VendorsController : Controller
  {
    private ILogger _logger;

    public VendorsController(ApplicationDbContext context, ILoggerFactory loggerFactory)
    {
      Context = context;
      _logger = loggerFactory.CreateLogger(typeof(VendorsController));
    }

    public ApplicationDbContext Context { get; }

    [HttpGet]
    public IActionResult GetVendors()
    {
      return Json(Context.Vendors.ToList().Select(x => new ClientVendor(x)));
    }

    [HttpPatch]
    public IActionResult PatchVendors([FromBody] List<ClientVendor> vendors)
    {
      var ids = vendors.Select(x => x.Id).ToList();
      var dbVendors = Context.Vendors.Where(x => ids.Contains(x.VendorId)).ToDictionary(x => x.VendorId, x => x);

      foreach (var vendor in vendors)
      {
        if (vendor == null || !dbVendors.ContainsKey(vendor.Id))
          return BadRequest($"No vendor found {vendor?.Id}");
        dbVendors[vendor.Id].City = vendor.City;
        dbVendors[vendor.Id].Country = vendor.Country;
        dbVendors[vendor.Id].Name = vendor.Name;
        dbVendors[vendor.Id].Phone = vendor.Phone;
        dbVendors[vendor.Id].State = vendor.State;
        dbVendors[vendor.Id].StreetAddress = vendor.StreetAddress;
        dbVendors[vendor.Id].ZipCode = vendor.ZipCode;
        Context.Vendors.Update(dbVendors[vendor.Id]);
      }
      Context.SaveChanges();

      return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteVendors([FromBody] List<string> vendors)
    {
      var dbVendors = Context.Vendors.Where(x => vendors.Contains(x.VendorId)).ToList();
      if (vendors.Count != dbVendors.Count)
        return NotFound("Some vendors");
      
      Context.Vendors.RemoveRange(dbVendors);
      Context.SaveChanges();

      return Ok();
    }
    [HttpPut]
    public IActionResult AddVendor([FromBody] List<ClientVendor> newVendors)
    {
      foreach (var newVendor in newVendors)
      {
        var vendor = new Vendor
        {
          City = newVendor.City,
          Country = newVendor.Country,
          Name = newVendor.Name,
          Phone = newVendor.Phone,
          State = newVendor.State,
          StreetAddress = newVendor.StreetAddress,
          ZipCode = newVendor.ZipCode
        };
        Context.Vendors.Add(vendor);
      }
      try
      {
        Context.SaveChanges();
      }
      catch (DbUpdateException ex)
      {
        _logger.LogError("AddVendor", ex);
        return BadRequest("Failed to update database, vendor might already exist");
      }

      return Ok();
    }
  }
}
