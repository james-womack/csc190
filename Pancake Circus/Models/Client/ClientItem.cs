using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PancakeCircus.Models.SQL;

namespace PancakeCircus.Models.Client
{
    public class ClientItem
    {
        public ClientItem() { }

        public ClientItem(Item item)
        {
            Id = item.ItemId;
            Name = item.Name;
            Units = item.Units;
            MinimumAmount = item.MinimumAmount;
        }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Units { get; set; }
        public double MinimumAmount { get; set; }
    }
}
