using JobBoard.Models.Industry;
using JobBoard.Models.Tags;
using JobBoard.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace JobBoard.Models
{
    public class ApplicationUser : IdentityUser
	{
		public List<IndustryModel> IndustryPreferences { get; set; } = new List<IndustryModel>();
		public List<TagModel> TagPreferences { get; set; } = new List<TagModel>();
		public List<AwardModel> Awards { get; set; } = new List<AwardModel>();
		public ResumeModel? Resume { get; set; }
		public BioModel Bio { get; set; } = new BioModel();
	}
}