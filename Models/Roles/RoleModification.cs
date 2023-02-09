using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Roles
{
	public class RoleModification
	{
		[Required]
		public string RoleId { get; set; }
		[Required]
		public string RoleName { get; set; } = string.Empty;

		public string[]? AddIds { get; set; }
		public string[]? RemoveIds { get; set; }
	}
}
