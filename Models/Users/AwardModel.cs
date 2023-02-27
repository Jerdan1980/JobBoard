using JobBoard.Models.Competitions;
using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Users
{
	public class AwardModel
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public string UserId { get; set; }
		public ApplicationUser User { get; set; }
		[Required]
		public int CompetitionId { get; set; }
		public CompetitionModel Competition { get; set; }
		[Required]
		public string Rank { get; set; }
	}
}
