using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PancakeCircus.Data;
using PancakeCircus.Models.Client;

namespace PancakeCircus.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class VendorsController : Controller
    {
      public ApplicationDbContext Context { get; }
      public VendorsController(ApplicationDbContext context)
      {
        Context = context;
      }
      [HttpGet]
      public IActionResult GetVendors()
      {
        return Json(Context.Vendors.ToList().Select(x => new ClientVendor(x)));
      }
    }
}