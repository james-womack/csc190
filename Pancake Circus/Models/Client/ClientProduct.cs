namespace PancakeCircus.Models.Client
{
  public class ClientProduct
  {
    public ClientItem Item { get; set; }
    public ClientVendor Vendor { get; set; }
    public string SKU { get; set; }
    public int Price { get; set; }
    public double PackageAmt { get; set; }
  }
}