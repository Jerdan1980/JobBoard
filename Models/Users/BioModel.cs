using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Users
{
	public class BioModel
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public string UserId { get; set; }
		public ApplicationUser? User { get; set; }
		[Required]
		public string Name { get; set; } = "Unnamed User";
		[Required]
		public PrivacyLevel PrivacyLevel { get; set; } = PrivacyLevel.Private;
	}
}
