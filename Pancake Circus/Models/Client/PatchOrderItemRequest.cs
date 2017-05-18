using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.Client
{
    public class PatchOrderItemRequest
    {
      public string ItemId { get; set; }
      public string VendorId { get; set; }
      public string OrderId { get; set; }
      public int OrderAmount { get; set; }
      public int PaidPrice { get; set; }
      public int TotalAmount { get; set; }
    }
}
