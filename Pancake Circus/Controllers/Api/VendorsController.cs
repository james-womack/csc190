using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
      public ApplicationDbContext Context { get; }
      private ILogger _logger;
      public VendorsController(ApplicationDbContext context, ILoggerFactory loggerFactory)
      {
        Context = context;
        _logger = loggerFactory.CreateLogger(typeof(VendorsController));
      }
      [HttpGet]
      public IActionResult GetVendors()
      {
        return Json(Context.Vendors.ToList().Select(x => new ClientVendor(x)));
      }

        [HttpPut]
        public IActionResult AddVendor([FromBody]ClientVendor newVendor)
        {
            var vendor = new Vendor()
            {
                City = newVendor.City,
                Country = newVendor.Country,
                Name = newVendor.Name,
                Phone = newVendor.Phone,
                State = newVendor.State,
                StreetAddress = newVendor.StreetAddress,
                ZipCode = newVendor.ZipCode
            };
            try
            {
                Context.Vendors.Add(vendor);
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