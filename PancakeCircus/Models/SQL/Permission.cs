using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PancakeCircus.Models.SQL
{
    public class Permission
    {
        public string PermissionId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Verbs { get; set; }
        public string Path { get; set; }
        public List<UserPermission> Permissions { get; set; }
    }
}
