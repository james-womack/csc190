using PancakeCircus.Models.SQL;

namespace PancakeCircus.Models.Client
{
    public class ClientStock
    {
        public ClientStock()
        {
        }

        public ClientStock(Stock stock)
        {
            Item = new ClientItem(stock.Item);
            Vendor = new ClientVendor(stock.Vendor);
            Amount = stock.Amount;
            Location = stock.Location;
        }

        public ClientItem Item { get; set; }
        public ClientVendor Vendor { get; set; }
        public double Amount { get; set; }
        public string Location { get; set; }
    }
}