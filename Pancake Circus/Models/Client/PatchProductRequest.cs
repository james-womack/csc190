using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.Client
{
    public class PatchProductRequest
    {
      public string ItemId { get; set; }
      public string VendorId { get; set; }
      public int Price { get; set; }
      public int PackageAmount { get; set; }
      public string SKU { get; set; }
    }
}
