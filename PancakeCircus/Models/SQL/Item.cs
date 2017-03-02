using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace PancakeCircus.Models.SQL
{
    public class Item
    {
        public string ItemId    { get; set; }
        public string Name      { get; set; }
        public string Units     { get; set; }
        public List<Stock> Stocks { get; set; }
        public List<Product> Products { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public double MinimumAmount { get; set; }
     

    }
}
