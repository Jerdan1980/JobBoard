using Microsoft.AspNetCore.Identity;

namespace JobBoard.Models.Roles
{
	public class RoleDTO
	{
		public IdentityRole Role { get; set; }
		public IEnumerable<ApplicationUser> Members { get; set; }
		public IEnumerable<ApplicationUser> NonMembers { get; set; }
	}
}
