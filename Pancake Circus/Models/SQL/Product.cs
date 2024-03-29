﻿namespace PancakeCircus.Models.SQL
{
  public class Product
  {
    public string ItemId { get; set; }
    public string VendorId { get; set; }
    public Item Item { get; set; }
    public Vendor Vendor { get; set; }

    public int Price { get; set; }
    public string SKU { get; set; }
    public double PackageAmount { get; set; }
  }
}
