using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PancakeCircus.Models;
using PancakeCircus.Models.SQL;

namespace PancakeCircus.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        private static Random Random { get; } = new Random();
        public DbSet<Item> Items { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>(entity => entity.Property(m => m.Id).HasMaxLength(127));
            builder.Entity<IdentityRole>(entity => entity.Property(m => m.Id).HasMaxLength(127));
            builder.Entity<IdentityRoleClaim<string>>(entity => entity.Property(m => m.RoleId).HasMaxLength(127));
            builder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.LoginProvider).HasMaxLength(127));
            builder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.ProviderKey).HasMaxLength(127));
            builder.Entity<IdentityUserLogin<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(127));
            builder.Entity<IdentityUserClaim<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(127));
            builder.Entity<IdentityUserRole<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(127));
            builder.Entity<IdentityUserRole<string>>(entity => entity.Property(m => m.RoleId).HasMaxLength(127));
            builder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.UserId).HasMaxLength(127));
            builder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.LoginProvider).HasMaxLength(127));
            builder.Entity<IdentityUserToken<string>>(entity => entity.Property(m => m.Name).HasMaxLength(127));
            builder.Entity<Item>(x => x.Property(m => m.ItemId).HasMaxLength(127));
            builder.Entity<Vendor>(x => x.Property(m => m.VendorId).HasMaxLength(127));
            builder.Entity<Order>(x => x.Property(m => m.OrderId).HasMaxLength(127));
            builder.Entity<Stock>(x => x.Property(m => m.ItemId).HasMaxLength(127));
            builder.Entity<Stock>(x => x.Property(m => m.VendorId).HasMaxLength(127));
            builder.Entity<Product>(x => x.Property(m => m.ItemId).HasMaxLength(127));
            builder.Entity<Product>(x => x.Property(m => m.VendorId).HasMaxLength(127));
            builder.Entity<OrderItem>(x => x.Property(m => m.ItemId).HasMaxLength(127));
            builder.Entity<OrderItem>(x => x.Property(m => m.VendorId).HasMaxLength(127));
            builder.Entity<OrderItem>(x => x.Property(m => m.OrderId).HasMaxLength(127));

            builder.Entity<OrderItem>()
                .HasOne(p => p.Item)
                .WithMany(i => i.OrderItems)
                .HasForeignKey(p => p.ItemId);
            builder.Entity<OrderItem>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.OrderItems)
                .HasForeignKey(p => p.VendorId);
            builder.Entity<OrderItem>()
                .HasOne(p => p.Order)
                .WithMany(v => v.OrderItems)
                .HasForeignKey(p => p.OrderId);

            builder.Entity<OrderItem>()
                .HasKey(o => new {o.ItemId, o.VendorId, o.OrderId});




            builder.Entity<Product>()
                .HasOne(p => p.Item)
                .WithMany(i => i.Products)
                .HasForeignKey(p => p.ItemId);
            builder.Entity<Product>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.Products)
                .HasForeignKey(p => p.VendorId);

            builder.Entity<Product>()
                .HasKey(p => new {p.ItemId, p.VendorId});


            builder.Entity<Stock>()
                .HasOne(p => p.Item)
                .WithMany(i => i.Stocks)
                .HasForeignKey(p => p.ItemId);
            builder.Entity<Stock>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.Stocks)
                .HasForeignKey(p => p.VendorId);
            builder.Entity<Stock>()
                .HasKey(p => new {p.ItemId, p.VendorId});
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        public void Init()
        {
            if (Items.Any())
                return;

            var items = new[]
            {
                new Item() {MinimumAmount = 10, Name = "Eggs", Units = "Dozen"},
                new Item() {MinimumAmount = 15, Name = "Milk", Units = "Gallons"},
                new Item() {MinimumAmount = 20, Name = "Flour", Units = "Lbs"},
                new Item() {MinimumAmount = 5, Name = "Syrup", Units = "Gallons"},
                new Item() {MinimumAmount = 2, Name = "Chocolate", Units = "Lbs"},
                new Item() {MinimumAmount = 25, Name = "Strawberries", Units = "Bunches"},
                new Item() {MinimumAmount = 3, Name = "Ice Cream", Units = "Gallons"},
                new Item() {MinimumAmount = 10, Name = "Sugar", Units = "Lbs"},
                new Item() {MinimumAmount = 4, Name = "Corn Syrup", Units = "Gallons"},
                new Item() {MinimumAmount = 5, Name = "Sugar (Powdered)", Units = "Lbs"},
                new Item() {MinimumAmount = 10, Name = "Salt", Units = "Oz"},
            };
            var vendors = new[]
            {
                new Vendor()
                {
                    City = "Sacramento",
                    Name = "Cisco",
                    Country = "United States",
                    Phone = "123-456-7890",
                    State = "CA",
                    StreetAddress = "1000 J St.",
                    ZipCode = "93103"
                },
                new Vendor()
                {
                    City = "San Fransisco",
                    Name = "USA Food",
                    Country = "United States",
                    Phone = "123-666-7890",
                    State = "CA",
                    StreetAddress = "1300 Main St.",
                    ZipCode = "90043"
                },
                new Vendor()
                {
                    City = "Sacramento",
                    Name = "Whole Foods",
                    Country = "United States",
                    Phone = "555-456-0987",
                    State = "CA",
                    StreetAddress = "100 H St.",
                    ZipCode = "93103"
                },
            };

            var orders = new[]
            {
                new Order() {Status = OrderStatus.None, OrderDate = DateTime.Now},
                new Order() {Status = OrderStatus.Approved, OrderDate = DateTime.Now.Subtract(TimeSpan.FromDays(1))},
                new Order() {Status = OrderStatus.Approved, OrderDate = DateTime.Now.Subtract(TimeSpan.FromDays(2))},
                new Order() {Status = OrderStatus.Denied, OrderDate = DateTime.Now.Subtract(TimeSpan.FromDays(3))},
                new Order() {Status = OrderStatus.Fulfilled, OrderDate = DateTime.Now.Subtract(TimeSpan.FromDays(4))},
                new Order() {Status = OrderStatus.Denied, OrderDate = DateTime.Now.Subtract(TimeSpan.FromDays(5))},
                new Order() {Status = OrderStatus.Fulfilled, OrderDate = DateTime.Now.Subtract(TimeSpan.FromDays(6))},
                new Order() {Status = OrderStatus.Approved, OrderDate = DateTime.Now.Subtract(TimeSpan.FromDays(7))},
            };

            // Add dummy rows
            Items.AddRange(items);
            Vendors.AddRange(vendors);
            Orders.AddRange(orders);
            SaveChanges();

            // Go ahead and add the items to each vendor and such
            var dbItems = Items.ToList();
            var dbVendors = Vendors.ToList();
            var dbOrders = Orders.ToList();
            var products = new List<Product>();
            for (var i = 0; i < dbItems.Count; ++i)
            {
                products.AddRange(from v in dbVendors.Where((x, ij) => ij % 10 != 0 || i % 2 == 0)
                    let pkgAmt = Random.Next(6, 24)
                    let price = Random.Next(25, 200) * pkgAmt
                    let sku = Guid.NewGuid().ToString()
                    select
                    new Product() {Item = dbItems[i], Vendor = v, PackageAmount = pkgAmt, Price = price, SKU = sku});
            }

            var orderItems = new List<OrderItem>();
            foreach (var t in dbOrders)
            {
                orderItems.AddRange(from t1 in dbItems
                    select products.OrderBy(x => Guid.NewGuid()).First(x => x.Item == t1)
                    into randProd
                    let orderAmt = Random.Next(1, 4)
                    let paid = orderAmt * randProd.Price * randProd.PackageAmount
                    select new OrderItem()
                    {
                        Item = randProd.Item,
                        ItemId = randProd.Item.ItemId,
                        Vendor = randProd.Vendor,
                        VendorId = randProd.Vendor.VendorId,
                        Order = t,
                        OrderId = t.OrderId,
                        OrderAmount = orderAmt,
                        PaidPrice = (int)Math.Ceiling(paid)
                    });
            }

            var q =
                orderItems.GroupBy(x => new {x.Item, x.Order, x.Vendor})
                    .Where(g => g.Count() > 1)
                    .Select(y => y.Key)
                    .ToList();

            foreach (var k in q)
            {
                Console.WriteLine($"Order {k.Order.OrderId} Name {k.Item.Name} Vendor {k.Vendor.Name}");
            }

            var newestFulfilledOrder = orders.OrderBy(x => x.OrderDate).First(x => x.Status == OrderStatus.Fulfilled);
            var stocks = (
                from oi in orderItems
                where oi.OrderId == newestFulfilledOrder.OrderId
                let prod = products.First(x => x.Item == oi.Item && x.Vendor == oi.Vendor)
                select new Stock()
                {
                    Amount = oi.OrderAmount * prod.PackageAmount,
                    Item = oi.Item,
                    ItemId = oi.ItemId,
                    Vendor = oi.Vendor,
                    VendorId = oi.VendorId
                }).ToList();

            var shelfNums = GenerateSequence(1, stocks.Count + 1).ToList();
            foreach (var s in stocks)
            {
                s.Location = $"Shelf {shelfNums[Random.Next(0, shelfNums.Count)]}";
            }

            Products.AddRange(products);
            OrderItems.AddRange(orderItems);
            Stocks.AddRange(stocks);
            SaveChanges();
        }

        private static IEnumerable<int> GenerateSequence(int from, int to)
        {
            if (from < to)
                while (from < to)
                    yield return from++;
            else
                while (from >= to)
                    yield return from--;
        }
    }
}
