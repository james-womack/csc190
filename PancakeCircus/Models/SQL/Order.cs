﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.SQL
{
    public class Order
    {
        public string OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public bool Fulfilled { get; set; }
        public List<OrderItem> OrderItems { get; set; }
            
    }
}
