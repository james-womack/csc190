using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.SQL
{
    public class Vendor
    {
        public string VendorId { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public List<Stock> Stocks { get; set; }
        public List<Product> Products { get; set; }
        public List<OrderItem> OrderItems { get; set; }

    }
}
