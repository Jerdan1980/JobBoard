using Duende.IdentityServer.EntityFramework.Options;
using JobBoard.Models;
using JobBoard.Models.Competitions;
using JobBoard.Models.Industry;
using JobBoard.Models.Jobs;
using JobBoard.Models.Tags;
using JobBoard.Models.Users;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace JobBoard.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
	{
		public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
			: base(options, operationalStoreOptions)
		{

		}

		public DbSet<CompetitionModel> Competitions { get; set; }
		public DbSet<TagModel> Tags { get; set; }
		public DbSet<JobModel> Jobs { get; set; }
		public DbSet<IndustryModel> Industries { get; set; }
		public DbSet<ResumeModel> Resumes { get; set; }
	}
}