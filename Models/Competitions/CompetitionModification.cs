using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Competitions
{
	public class CompetitionModification
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Name { get; set; } = string.Empty;
		public string? Description { get; set; }
		public DateTime? StartTime { get; set; }
		public DateTime? EndTime { get; set; }
		public bool Automated { get; set; }


		public int[]? TagIds { get; set; }
	}
}
