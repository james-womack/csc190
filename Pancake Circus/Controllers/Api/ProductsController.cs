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
    public class ProductsController : Controller
    {
        [HttpPut]
        public IActionResult AddProduct([FromBody]Product product)
        {
            return Ok();
        }
        [HttpPatch]
        public IActionResult PatchProduct([FromBody]Product product)
        {
            return Ok();
        }
        public IActionResult DelteProduct([FromBody]Product product)
        {
            bool notFound = false;
            if (notFound) {
                return NotFound();
            }
            return Ok();
        }
        //Dont know if this is how you do the import part
        // Also I dont know how to input the cvs part into it. 
        [HttpPut("import")]
        public IActionResult PutProduct([FromBody]Product product)
        {
            return Ok();
        } 
    }
}
