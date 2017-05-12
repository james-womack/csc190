using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.Client
{
    public class AddStockRequest
    {
      public string ItemId { get; set; }
      public string VendorId { get; set; }
      public int Amount { get; set; }
      public string Location { get; set; }
    }
}
