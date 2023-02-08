using JobBoard.Models.Competitions;
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
		//public List<AutoCompetition> AutoCompetitions { get; set; } = new List<AutoCompetition>();
	}
}
