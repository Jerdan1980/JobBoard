using JobBoard.Data;
using JobBoard.Models;
using JobBoard.Models.Users;
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

	}
}
