using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Roles
{
	public class CreateRole
	{
		[Required]
		public string Name { get; set; } = string.Empty;
	}
}
