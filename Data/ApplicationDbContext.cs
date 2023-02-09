﻿using Duende.IdentityServer.EntityFramework.Options;
using JobBoard.Models;
using JobBoard.Models.Competitions;
using JobBoard.Models.Tags;
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
	}
}