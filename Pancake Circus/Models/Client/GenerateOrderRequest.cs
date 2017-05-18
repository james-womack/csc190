using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.Client
{
    public class GenerateOrderRequest
    {
      public string PerferredVendorId { get; set; }
      public double SafetyFactor { get; set; }
    }
}
