using JobBoard.Data;
using JobBoard.Models;
using JobBoard.QuartzJobs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Quartz;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
	options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
	.AddRoles<IdentityRole>()
	.AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentityServer()
	.AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

builder.Services.AddAuthentication()
	.AddIdentityServerJwt();

//https://stackoverflow.com/questions/51064314/services-addjsonoptions-net-core-2-1
builder.Services.AddControllersWithViews()
	.AddJsonOptions(options => { 
		options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
	});
builder.Services.AddRazorPages();

// Setup Quartz and ADO.NET
ApplicationAdoConnection.ConnectionString = connectionString;
//https://www.quartz-scheduler.net/documentation/quartz-3.x/packages/aspnet-core-integration.html
builder.Services.AddQuartz(quartz =>
{
	quartz.UseMicrosoftDependencyInjectionJobFactory();

	quartz.AddJob<GrabKontestsJob>(options => options.WithIdentity(GrabKontestsJob.Key));

	// Triggers once on application start
	quartz.AddTrigger(options => options
		.ForJob(GrabKontestsJob.Key)
		.WithIdentity("GrabKontests-trigger-now")
	);

	// Runs periodically to update data
	quartz.AddTrigger(options => options
		.ForJob(GrabKontestsJob.Key)
		.WithIdentity("GrabKontestsJob-trigger-min")
		// This Cron interval can be described as "run every 15 minutes" (when second is zero)
		//http://www.cronmaker.com/?0 to get custom string (has UI interface)
		.WithCronSchedule("0 0/15 * 1/1 * ? *")
	);

});
builder.Services.AddQuartzHostedService(quartz => quartz.WaitForJobsToComplete = true);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseMigrationsEndPoint();
}
else
{
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();

app.MapControllerRoute(
	name: "default",
	pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.Run();
