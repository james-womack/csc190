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
        public PancakeContext(DbContextOptions<PancakeContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {

        }
    }


}
