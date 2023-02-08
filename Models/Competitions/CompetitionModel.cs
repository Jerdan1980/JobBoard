using JobBoard.Models.Tags;
using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Competitions
{
	public class CompetitionModel
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Name { get; set; }
		public string? Description { get; set; }
		public DateTime? StartTime { get; set; }
		public DateTime? EndTime { get; set; }
		public bool Automated { get; set; }

		public List<int> TagIds { get; set; }
		public List<TagModel> Tags { get; set; }

		//[Required]
		//public int OwnerId { get; set; }
		//public UserBio? Owner { get; set; }
		
	}
}
