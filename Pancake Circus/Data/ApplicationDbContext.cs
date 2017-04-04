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
            builder.Entity<OrderItem>(x => x.Property(m => m.PartId).HasMaxLength(127));
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
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
