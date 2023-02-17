using JobBoard.Models.Industry;
using Microsoft.AspNetCore.Identity;

namespace JobBoard.Models
{
    public class ApplicationUser : IdentityUser
	{
		public List<IndustryModel> IndustryPreferences { get; set; } = new List<IndustryModel>();
		public ResumeModel? Resume { get; set; }
	}
}