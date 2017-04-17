using System;
using System.Collections.Generic;

namespace PancakeCircus.Models.SQL
{
  public class Order
  {
    public string OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public List<OrderItem> OrderItems { get; set; }
  }

  public enum OrderStatus
  {
    None,
    Fulfilled,
    Denied,
    Approved
  }
}