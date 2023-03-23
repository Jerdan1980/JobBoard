using JobBoard.Models.Tags;
using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Competitions
{
	public class CompetitionModel
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Name { get; set; } = string.Empty;
		public string? Description { get; set; }
		public DateTime? StartTime { get; set; }
		public DateTime? EndTime { get; set; }
		[Required]
		public bool Automated { get; set; }

		// many-to-many requires lists on both ends
		public List<TagModel> Tags { get; set; } = new List<TagModel>();

		//[Required]
		//public int OwnerId { get; set; }
		//public UserBio? Owner { get; set; }

		public virtual CompetitionDetails ToCompetitionDetails()
		{
			return new CompetitionDetails
			{
				Id = Id,
				Name = Name,
				Description = Description,
				StartTime = StartTime,
				EndTime = EndTime,
				Automated = Automated,
				Tags = Tags
			};
		}

	}
}
