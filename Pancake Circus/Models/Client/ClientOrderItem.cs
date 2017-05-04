using PancakeCircus.Models.SQL;

namespace PancakeCircus.Models.Client
{
  public class ClientOrderItem
  {
    public ClientOrderItem()
    {
    }

    public ClientOrderItem(OrderItem orderItem, Product product = null)
    {
      Item = new ClientItem(orderItem.Item);
      Vendor = new ClientVendor(orderItem.Vendor);
      Order = new ClientOrder(orderItem.Order, false);
      PaidPrice = orderItem.PaidPrice;
      OrderAmount = orderItem.OrderAmount;
      if (product != null){
        Product = new ClientProduct(product, orderItem.Item, orderItem.Vendor);
      }
    }

    public ClientItem Item { get; set; }
    public ClientVendor Vendor { get; set; }
    public ClientOrder Order { get; set; } 
    public ClientProduct Product { get; set; }
    public int PaidPrice { get; set; }
    public int OrderAmount { get; set; }
    
  }
}
