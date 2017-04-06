using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.SQL
{
    public class Product
    {
        public string ItemId { get; set; }
        public string VendorId { get; set; }
        public Item Item { get; set; }
        public Vendor Vendor { get; set; }

        public int Price { get; set; }
        public string sku { get; set; }
        public double packageAmount { get; set; }
    }
}
