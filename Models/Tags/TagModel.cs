using JobBoard.Models.Competitions;
using JobBoard.Models.Jobs;
using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Tags
{
	public class TagModel
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public string Name { get; set; } = string.Empty;
		public string? Description { get; set; }

		// Two many-to-many foreign keys
		public List<CompetitionModel> Competitions { get; set; } = new List<CompetitionModel>();
		public List<JobModel> Jobs { get; set; } = new List<JobModel>();
		public List<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();

	}
}
