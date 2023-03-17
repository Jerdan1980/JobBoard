using JobBoard.Data;
using JobBoard.Models;
using JobBoard.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobBoard.Controllers.Manual
{
	[ApiController]
	[Route("api/[controller]")]
	public class BiosController : ControllerBase
	{
		public readonly ApplicationDbContext _context;
		private UserManager<ApplicationUser> _userManager;

		public BiosController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
		{
			_context = context;
			_userManager = userManager;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<BioModel>>> GetBios()
		{
			return await _context.Bios
				.Select(bio => new BioModel
				{
					Id = bio.Id,
					UserId = bio.UserId,
					Name = (bio.PrivacyLevel == PrivacyLevel.Public) ? bio.Name : "Private User",
					PrivacyLevel = bio.PrivacyLevel,
				})
				.ToListAsync();
		}

		// api/Bios/asdfasdf-asdfas-dfasd-f123413241234 (not to scale)
		// uses the USER ID
		[HttpGet("user/{id:guid}")]
		public async Task<ActionResult<BioModel>> GetBiosViaUserId(string id)
		{
			BioModel? bio = await _context.Bios
				.Where(bio => bio.UserId == id)
				.Select(bio => new BioModel
				{
					Id = bio.Id,
					UserId = bio.UserId,
					Name = (bio.PrivacyLevel == PrivacyLevel.Public) ? bio.Name : "Private User",
					PrivacyLevel = bio.PrivacyLevel,
				})
				.FirstOrDefaultAsync();

			if (bio == null)
				return NotFound();
			return bio;
		}

		// api/Bios/5
		// uses the BIO ID
		[HttpGet("bio/{id:int}")]
		public async Task<ActionResult<BioModel>> GetBiosViaBioId(int id)
		{
			BioModel? bio = await _context.Bios
				.Where(bio => bio.Id == id)
				.Select(bio => new BioModel
				{
					Id = bio.Id,
					UserId = bio.UserId,
					Name = (bio.PrivacyLevel == PrivacyLevel.Public) ? bio.Name : "Private User",
					PrivacyLevel = bio.PrivacyLevel,
				})
				.FirstOrDefaultAsync();

			if (bio == null)
				return NotFound();
			return bio;
		}
	}
}
