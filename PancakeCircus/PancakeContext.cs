using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PancakeCircus.Models.SQL;

namespace PancakeCircus 
{

    public class PancakeContext : DbContext
    {
        public DbSet<Item> Items { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Product>Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public PancakeContext(DbContextOptions<PancakeContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<OrderItem>().HasIndex(i => i.PartId).IsUnique();

            builder.Entity<OrderItem>()
                .HasOne(p => p.Item)
                .WithMany(i => i.OrderItems)
                .HasForeignKey(p => p.VendorId);
            builder.Entity<OrderItem>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.OrderItems)
                .HasForeignKey(p => p.ItemId);
            builder.Entity<OrderItem>()
                .HasOne(p => p.Order)
                .WithMany(v => v.OrderItems)
                .HasForeignKey(p => p.ItemId);

            builder.Entity<OrderItem>()
                .HasKey(o => new { o.ItemId, o.VendorId, o.OrderId });




            builder.Entity<Product>()
                .HasOne(p => p.Item)
                .WithMany(i => i.Products)
                .HasForeignKey(p => p.VendorId);
            builder.Entity<Product>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.Products)
                .HasForeignKey(p => p.ItemId);

            builder.Entity<Product>()
                .HasKey(p => new { p.ItemId, p.VendorId });


            builder.Entity<Stock>()
                .HasOne(p => p.Item)
                .WithMany(i => i.Stocks)
                .HasForeignKey(p => p.VendorId);
            builder.Entity<Stock>()
                .HasOne(p => p.Vendor)
                .WithMany(v => v.Stocks)
                .HasForeignKey(p => p.ItemId);
            builder.Entity<Stock>()
                .HasKey(p => new { p.ItemId, p.VendorId });

            builder.Entity<UserPermission>()
                .HasOne(p => p.Permission)
                .WithMany(i => i.Permissions)
                .HasForeignKey(p => p.PermissionId);
            builder.Entity<UserPermission>()
                .HasOne(p => p.User)
                .WithMany(u => u.Permissions)
                .HasForeignKey(p => p.UserId);
            builder.Entity<UserPermission>()
                .HasKey(p => new { p.PermissionId, p.UserId });



        }
    }


}
