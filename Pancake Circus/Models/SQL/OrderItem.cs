using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.SQL
{
    public class OrderItem
    {
        public string OrderId { get; set; }
        public string VendorId { get; set; }
        public string ItemId { get; set; }
        public Order Order { get; set; }
        public Vendor Vendor { get; set; }
        public Item Item { get; set; }

        public int OrderAmount { get; set; }
        public int PaidPrice { get; set; }
    }
}
