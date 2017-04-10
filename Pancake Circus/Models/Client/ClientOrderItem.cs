using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PancakeCircus.Models.SQL;

namespace PancakeCircus.Models.Client
{
  public class ClientOrderItem
  {
    public ClientOrderItem() { }

    public ClientOrderItem(OrderItem orderItem)
    {
        Item = new ClientItem(orderItem.Item);
        Vendor = new ClientVendor(orderItem.Vendor);
        Order = new ClientOrder(orderItem.Order, false);
        PaidPrice = orderItem.PaidPrice;
        OrderAmount = orderItem.OrderAmount;
    }
    public ClientItem Item { get; set; }
    public ClientVendor Vendor { get; set; }
    public ClientOrder Order { get; set; }
    public int PaidPrice { get; set; }
    public int OrderAmount { get; set; }
  }
}
