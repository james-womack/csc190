using PancakeCircus.Models.SQL;

namespace PancakeCircus.Models.Client
{
  public class ClientProduct
  {
    public ClientProduct()
    {
    }

    public ClientProduct(Product prod, Item item, Vendor vendor)
    {
      SKU = prod.SKU;
      Price = prod.Price;
      PackageAmount = prod.PackageAmount;
      Item = new ClientItem(item);
      Vendor = new ClientVendor(vendor);
    }

    public ClientItem Item { get; set; }
    public ClientVendor Vendor { get; set; }
    public string SKU { get; set; }
    public int Price { get; set; }
    public double PackageAmount { get; set; }
  }
}
