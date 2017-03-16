using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace PancakeCircus.Models
{
    public class UserValidator<TUser> : IUserValidator<TUser> where TUser : IdentityUser
    {
        static readonly string theEmailPattern = @"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*"
                                   + "@"
                                   + @"((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))$";
        public Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user)
        {
            if (Regex.IsMatch(user.Email, theEmailPattern) &&
                string.Equals(user.Email, user.UserName, StringComparison.CurrentCultureIgnoreCase))
            {
                return Task.FromResult(IdentityResult.Success);
            }

            return Task.FromResult(IdentityResult.Failed(new IdentityError()
            {
                Code = "Invalid Username/Email",
                Description = "The email is invalid."
            }));
        }
    }
}
