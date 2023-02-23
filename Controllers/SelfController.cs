using JobBoard.Data;
using JobBoard.Models;
using JobBoard.Models.Industry;
using JobBoard.Models.Tags;
using JobBoard.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Runtime.CompilerServices;

namespace JobBoard.Controllers
{
    [Route("api/[controller]")]
	[ApiController]
	public class SelfController : ControllerBase
	{
		public readonly ApplicationDbContext _context;
		private UserManager<ApplicationUser> _userManager;
		private JsonWebTokenHandler _tokenHandler;

		public SelfController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
		{
			_context = context;
			_userManager = userManager;
			_tokenHandler = new JsonWebTokenHandler();
		}

		// Grabs only the PDF file since I dont know how to send that along with other data back
		[HttpGet("resume/file")]
		//[Authorize]
		public async Task<IActionResult> GetResumeFile()
		{
			string userId = BearerToken.GetUserId(Request);
			ResumeModel? resume = await _context.Resumes.Where(r => r.UserId == userId).FirstOrDefaultAsync();

			if (resume == null)
				return NotFound();
			return File(resume.Data, "application/pdf", resume.Name);
		}

		// Grabs only the Upload Date since I don't know how to send that long with the file
		[HttpGet("resume/date")]
		//[Authorize]
		public async Task<IActionResult> GetResumeDate()
		{
			string userId = BearerToken.GetUserId(Request);
			ResumeModel? resume = await _context.Resumes.Where(r => r.UserId == userId).FirstOrDefaultAsync();

			if (resume == null)
				return NotFound();
			// Format the datetime using the ISO 8601 web service format
			return Ok(resume.LastModified.ToString("yyyy-MM-ddTHH:mm:sszzz", System.Globalization.CultureInfo.InvariantCulture));
		}

		//https://stackoverflow.com/questions/40629947/receive-file-and-other-form-data-together-in-asp-net-core-web-api-boundary-base
		// UPDATES if it already exists (aka implement UPSERT)
		[HttpPost("resume")]
		//[Authorize]
		public async Task<IActionResult> UploadResume([FromForm] IFormCollection data, [FromForm] IFormFile file)
		{
			string userId = BearerToken.GetUserId(Request);
			ResumeModel? resume = await _context.Resumes.Where(r => r.UserId == userId).FirstOrDefaultAsync();

			// The file data is needed either way, do it outside the if statement for KISS
			//https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.iformfile?view=aspnetcore-7.0
			byte[] blob = new byte[file.Length];
			CancellationToken cancellationToken = CancellationToken.None;
			await file.OpenReadStream().ReadAsync(blob, cancellationToken);

			if (cancellationToken.IsCancellationRequested)
				return BadRequest();

			if (resume == null)
			{
				// Insert if no resume was found
				resume = new ResumeModel()
				{
					Id = 0,
					Name = file.FileName,
					Data = blob,
					LastModified = DateTime.Now,
					UserId = BearerToken.GetUserId(Request)
				};

				_context.Resumes.Add(resume);
			}
			else
			{
				// Just replace the data and update lastModified
				resume.Data = blob;
				resume.LastModified = DateTime.Now;

				_context.Update(resume);
			}

			await _context.SaveChangesAsync();
			return File(resume.Data, "application/pdf", resume.Name);
		}

		// DELETE: deletes the user's resume
		[HttpDelete("resume")]
		public async Task<IActionResult> DeleteResume()
		{
			string userId = BearerToken.GetUserId(Request);
			ResumeModel? resume = await _context.Resumes.Where(r => r.UserId == userId).FirstOrDefaultAsync();

			if (resume == null)
				return NotFound();

			try
			{
				_context.Resumes.Remove(resume);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, ex);
			}
		}

		[HttpGet("user")]
		//[Authorize]
		public async Task<ActionResult<ApplicationUser>> GetSelf()
		{
			string userId = BearerToken.GetUserId(Request);

			return await _userManager.FindByIdAsync(userId);
		}

		[HttpGet("preferences")]
		//[Authorize]
		public async Task<ActionResult<UserPreferences>> GetPreferences()
		{
			string userId = BearerToken.GetUserId(Request);

			UserPreferences? preferences = await _context.Users
				.Include(x => x.IndustryPreferences)
				.Include(x => x.TagPreferences)
				.Where(user => user.Id == userId)
				.Select(user => new UserPreferences
				{
					IndustryIds = user.IndustryPreferences.Select(industry => industry.Id).ToArray(),
					TagIds = user.TagPreferences.Select(tag => tag.Id).ToArray(),
				})
				.FirstOrDefaultAsync();

			if (preferences == null)
				return Ok(new UserPreferences());
			return Ok(preferences);
		}

		[HttpGet("preferences/count")]
		//[Authorize]
		public async Task<ActionResult<UserPreferencesCount>> GetPreferencesCount()
		{
			string userId = BearerToken.GetUserId(Request);

			UserPreferencesCount? preferences = await _context.Users
				.Include(x => x.IndustryPreferences)
				.Include(x => x.TagPreferences)
				.Where(user => user.Id == userId)
				.Select(user => new UserPreferencesCount
				{
					IndustryIds = user.IndustryPreferences.Select(industry => industry.Id).ToArray(),
					CareersCount = user.IndustryPreferences.Count(),
					TagIds = user.TagPreferences.Select(tag => tag.Id).ToArray(),
					CompetitionsCount = user.TagPreferences.Count(),
				})
				.FirstOrDefaultAsync();

			if (preferences == null)
				return Ok(new UserPreferencesCount());

			int numCareers = await _context.Jobs
				.Where(job => preferences.IndustryIds.Contains(job.IndustryId))
				.CountAsync();

			List<List<int>> compTags = await _context.Competitions
				.Include(x => x.Tags)
				.Select(comp => comp.Tags.Select(tag => tag.Id).ToList())
				.ToListAsync();

			int numCompetitions = compTags
				.Where(tags => tags.Exists(tag => preferences.TagIds.Contains(tag)))
				.Count();

			// This doesn't work and I have a working solution anyways so w/e
			//int numComp = await _context.Competitions
			//	.Include(x => x.Tags)
			//	.Where(comp => comp.Tags.Select(tag => tag.Id).ToList().Exists(tagId => preferences.TagIds.Contains(tagId)))
			//	.CountAsync();
			
			preferences.CareersCount = numCareers;
			preferences.CompetitionsCount = numCompetitions;

			return Ok(preferences);
		}

		[HttpPost("preferences")]
		//[Authorize]
		public async Task<IActionResult> SetPreferences(UserPreferences preferences)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			string userId = BearerToken.GetUserId(Request);
			ApplicationUser? user = await _context.Users
				.Include(x => x.IndustryPreferences)
				.Include(x => x.TagPreferences)
				.Where(user => user.Id == userId)
				.FirstOrDefaultAsync();
			if (user == null)
				return NotFound();

			user.IndustryPreferences.Clear();
			user.TagPreferences.Clear();

			foreach (int id in preferences.IndustryIds ?? new int[] { })
			{
				IndustryModel? industry = await _context.Industries.FindAsync(id);
				if (industry != null)
					user.IndustryPreferences.Add(industry);
			}

			foreach (int id in preferences.TagIds ?? new int[] { })
			{
				TagModel? tag = await _context.Tags.FindAsync(id);
				if (tag != null)
					user.TagPreferences.Add(tag);
			}

			try
			{
				_context.Users.Update(user);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, ex);
			}

		}
	}
}
