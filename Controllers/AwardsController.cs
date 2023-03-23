using JobBoard.Data;
using JobBoard.Models;
using JobBoard.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobBoard.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AwardsController : ControllerBase
	{
		public readonly ApplicationDbContext _context;
		private UserManager<ApplicationUser> _userManager;

		public AwardsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
		{
			_context = context;
			_userManager = userManager;
		}

		[HttpGet("comp/{id}")]
		public async Task<ActionResult<IEnumerable<AwardDTO>>> GetCompetitionAwards(int id)
		{
			return await _context.Awards
				.Where(award => award.CompetitionId == id)
				.Include(x => x.Competition)
				.Select(award => new AwardDTO
				{
					Id = award.Id,
					Rank = award.Rank,
					UserId = award.UserId,
					// Obfuscate information about non-public users
					UserName = (award.User.Bio.PrivacyLevel == PrivacyLevel.Public) ? award.User.Bio.Name : "Private User",
					CompetitionId = award.CompetitionId,
					CompetitionName = award.Competition.Name,
					CompetitionEndTime = award.Competition.EndTime.Value,
				})
				.ToListAsync();
		}

		[HttpPost]
		public async Task<IActionResult> UpdateCompetitionAwards(List<AwardModel> awards)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				_context.Awards.UpdateRange(awards);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception)
			{
				return NotFound();
			}

		}
	}
}
