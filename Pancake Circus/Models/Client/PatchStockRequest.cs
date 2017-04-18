using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.Client
{
    public class PatchStockRequest
    {
    public string ItemId { get; set; }
    public string VendorId { get; set; }
    public string Location { get; set; }
    public double Amount { get; set; }
    

    }
}
