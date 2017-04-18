using Microsoft.AspNetCore.Mvc;
using PancakeCircus.Models.SQL;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers.Api
{
  [Route("api/[controller]")]
  public class ItemsController : Controller
  {
    [HttpPut]
    public IActionResult AddItem([FromBody] Item item)
    {
      return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteItem([FromBody] Item item)
    {
      return Ok();
    }

    [HttpPatch]
    public IActionResult PatchItem([FromBody] Item item)
    {
      return Ok();
    }
  }
}