﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.Client
{
    public class DeleteOrderItemRequest
    {
      public string ItemId { get; set; }
      public string VendorId { get; set; }
      public string OrderId { get; set; }
    }
}
