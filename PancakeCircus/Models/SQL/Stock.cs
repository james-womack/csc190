using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.SQL
{
    public class Stock
    {
        public string ItemId { get; set; }
        public string VendorId { get; set; }
        public Item Item { get; set; }
        public Vendor Vendor { get; set; }

        public string Location { get; set; }
        public double Amount { get; set; }

    }
}
