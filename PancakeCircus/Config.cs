using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4;
using IdentityServer4.Models;

namespace PancakeCircus
{
    public class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>()
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>()
            {
                new ApiResource("api", "Main API")
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>()
            {
                new Client()
                {
                    ClientId = "client",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    // TODO: Change to storing in keystore!!!!!
                    ClientSecrets =
                    {
                        new Secret("slut random specifically something random".Sha256())
                    },

                    AllowedScopes = { "api" }
                },

                new Client()
                {
                    ClientId = "ro.client",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                    ClientSecrets =
                    {
                        new Secret("holly can't loca".Sha256())
                    },
                    
                    AllowedScopes = { "api" }
                },

                new Client()
                {
                    ClientId = "mvc",
                    ClientName = "MVC Client",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,

                    RequireConsent = true,

                    ClientSecrets =
                    {
                        new Secret("I gave it to you".Sha256())
                    },
                    
                    // TODO: Load from Database config
                    RedirectUris = { "http://localhost:5000/signin-oidc" },
                    PostLogoutRedirectUris = { "http://localhost:5000" },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "api"
                    },
                    AllowOfflineAccess = true
                }
            };
        }
    }
}
