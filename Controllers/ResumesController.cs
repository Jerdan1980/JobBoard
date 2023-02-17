using JobBoard.Data;
using JobBoard.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;

namespace JobBoard.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ResumesController : ControllerBase
	{
		public readonly ApplicationDbContext _context;
		private UserManager<ApplicationUser> _userManager;
		private JsonWebTokenHandler _tokenHandler;

		public ResumesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
		{
			_context = context;
			_userManager = userManager;
			_tokenHandler = new JsonWebTokenHandler();
		}

		// Will never get used. Remove after testing.
		[HttpGet]
		public async Task<ActionResult<IEnumerable<ResumeModel>>> GetResumes()
		{
			return await _context.Resumes.ToListAsync();
		}

		// Returns a pdf file only
		[HttpGet("{id}")]
		public async Task<IActionResult> GetResume(int id)
		{
			ResumeModel? resume = await _context.Resumes.Where(r => r.Id == id).FirstOrDefaultAsync();

			if (resume == null)
				return NotFound();

			return File(resume.Data, "application/pdf", resume.Name);

		}

		// Grabs only the PDF file since I dont know how to send that along with other data back
		[HttpGet("self/file")]
		[Authorize]
		public async Task<IActionResult> GetSelfResumeFile()
		{
			string userId = BearerToken.GetUserId(Request);
			ResumeModel? resume = await _context.Resumes.Where(r => r.UserId == userId).FirstOrDefaultAsync();

			if (resume == null)
				return NotFound();
			return File(resume.Data, "application/pdf", resume.Name);
		}

		// Grabs only the Upload Date since I don't know how to send that long with the file
		[HttpGet("self/date")]
		[Authorize]
		public async Task<IActionResult> GetSelfResumeDate()
		{
			string userId = BearerToken.GetUserId(Request);
			ResumeModel? resume = await _context.Resumes.Where(r => r.UserId == userId).FirstOrDefaultAsync();

			if (resume == null)
				return NotFound();
			// Format the datetime using the ISO 8601 web service format
			return Ok(resume.LastModified.ToString("yyyy-MM-ddTHH:mm:sszzz", System.Globalization.CultureInfo.InvariantCulture));
		}

		//https://stackoverflow.com/questions/40629947/receive-file-and-other-form-data-together-in-asp-net-core-web-api-boundary-base
		[HttpPost("self")]
		[Authorize]
		public async Task<IActionResult> UploadResume([FromForm] IFormCollection data, [FromForm] IFormFile file)
		{
			ResumeModel resume = new ResumeModel()
			{
				Id = 0,
				Name = file.FileName,
				LastModified = DateTime.Now,
				UserId = BearerToken.GetUserId(Request)
			};

			//https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.iformfile?view=aspnetcore-7.0
			resume.Data = new byte[file.Length];
			CancellationToken cancellationToken = CancellationToken.None;
			await file.OpenReadStream().ReadAsync(resume.Data, cancellationToken);

			if (cancellationToken.IsCancellationRequested)
				return BadRequest();

			// TODO: Add functionality to UPDATE if it already exists (aka implement UPSERT)

			_context.Resumes.Add(resume);
			await _context.SaveChangesAsync();

			return File(resume.Data, "application/pdf", resume.Name);
		}

		// TODO: Delete self resume
	}
}
