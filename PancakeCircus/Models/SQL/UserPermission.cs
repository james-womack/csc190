using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.SQL
{
    public class UserPermission
    {
        public string UserId { get; set; }
        public string PermissionId { get; set; }
        public User User { get; set; }
        public Permission Permission { get; set; }


    }
}
