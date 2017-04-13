using PancakeCircus.Models.SQL;

namespace PancakeCircus.Models.Client
{
    public class ClientVendor
    {
        public ClientVendor()
        {
        }

        public ClientVendor(Vendor vendor)
        {
            Id = vendor.VendorId;
            Name = vendor.Name;
            Phone = vendor.Phone;
            StreetAddress = vendor.StreetAddress;
            City = vendor.City;
            ZipCode = vendor.ZipCode;
            State = vendor.State;
            Country = vendor.Country;
        }
        

        public string Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
    }
}