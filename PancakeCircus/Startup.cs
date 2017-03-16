using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using MySQL.Data.Entity.Extensions;
using PancakeCircus.Models;
using PancakeCircus.Models.SQL;

namespace PancakeCircus
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc();
            services.AddDbContext<PancakeContext>(options => options.UseMySQL(Configuration.GetConnectionString("DebugConnection"), b=>b.MigrationsAssembly("PancakeCircus")));
            services.AddIdentity<User, IdentityRole>(opt =>
            {
                opt.Password.RequireDigit = true;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireLowercase = false;
                opt.Password.RequireUppercase = false;
                opt.Password.RequiredLength = 8;

                opt.Lockout.MaxFailedAccessAttempts = 10;

                opt.Cookies.ApplicationCookie.ExpireTimeSpan = TimeSpan.FromDays(120);
                opt.Cookies.ApplicationCookie.LoginPath = "/Account/Login";
                opt.Cookies.ApplicationCookie.LogoutPath = "/Account/Logout";

                opt.User.RequireUniqueEmail = true;
                opt.SignIn.RequireConfirmedEmail = false;
                opt.SignIn.RequireConfirmedPhoneNumber = false;
            })
                .AddEntityFrameworkStores<PancakeContext>()
                .AddDefaultTokenProviders()
                .AddUserValidator<UserValidator<User>>();
            
            services.AddIdentityServer()
                .AddTemporarySigningCredential()
                .AddInMemoryPersistedGrants()
                .AddInMemoryIdentityResources(Config.GetIdentityResources())
                .AddInMemoryApiResources(Config.GetApiResources())
                .AddInMemoryClients(Config.GetClients())
                .AddAspNetIdentity<User>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, PancakeContext context) 
        {
            context.Database.EnsureCreated();
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseIdentityServerAuthentication(new IdentityServerAuthenticationOptions()
            {
                // TODO: Load from configuration file so we can change later
                Authority = "http://localhost:5000",
                RequireHttpsMetadata = false,

                ApiName = "api"
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseIdentity();
            app.UseIdentityServer();
            app.UseStaticFiles();
            app.UseMvc();
        }
    }
}
