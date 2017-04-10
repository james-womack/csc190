using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PancakeCircus.Models.SQL;

namespace PancakeCircus.Models.Client
{
    public class ClientOrder
    {
        public ClientOrder(){ }

        public ClientOrder(Order order, bool fillClientOrder = true)
        {
            Id = order.OrderId;
            Status = order.Status;
            OrderDate = order.OrderDate;
            PricePaid = order.OrderItems?.Sum(x => x.PaidPrice) ?? 0;
            ItemCount = order.OrderItems?.Count ?? 0;
        }
        public string Id { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime OrderDate { get; set; }
        public int PricePaid { get; set; }
        public int ItemCount { get; set; }
    }
}
