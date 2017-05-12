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
  public class ItemsController : Controller
  {
    public ItemsController(ApplicationDbContext context)
    {
      Context = context;
    }

    public ApplicationDbContext Context { get; }

    [HttpPut]
    public IActionResult AddItem([FromBody] List<ClientItem> items)
    {
      // Add new item to the database
      foreach (var item in items)
      {
        var newItem = new Item()
        {
          MinimumAmount = item.MinimumAmount,
          Name = item.Name,
          Units = item.Units
        };
        Context.Items.Add(newItem);
      }
      Context.SaveChanges();
      return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteItem([FromBody] List<string> items)
    {
      // Find the items to delete
      var dbItems = Context.Items.Where(x => items.Contains(x.ItemId));
      Context.Items.RemoveRange(dbItems);
      Context.SaveChanges();

      return Ok();
    }

    [HttpPatch]
    public IActionResult PatchItem([FromBody] List<ClientItem> items)
    {
      // List of DB items ids
      var ids = items.Select(x => x.Id).ToList();
      var dbItems = Context.Items.Where(x => ids.Contains(x.ItemId)).ToDictionary(x => x.ItemId, x => x);

      // Patch the DB items
      foreach (var item in items)
      {
        if (item != null && dbItems.ContainsKey(item.Id))
        {
          dbItems[item.Id].Name = item.Name;
          dbItems[item.Id].MinimumAmount = item.MinimumAmount;
          dbItems[item.Id].Units = item.Units;
        }
        else
        {
          return BadRequest($"Invalid item set: item {item?.Id} not found");
        }
      }
      Context.Items.UpdateRange(dbItems.Values.ToList());
      Context.SaveChanges();
      return Ok();
    }

    [HttpGet]
    public IActionResult GetItems()
    {
      return Json(Context.Items.ToList().Select(x => new ClientItem(x)));
    }
  }
}
