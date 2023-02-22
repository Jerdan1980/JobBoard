using JobBoard.Data;
using JobBoard.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace JobBoard.Controllers.Manual
{
	[ApiController]
	[Route("api/[controller]")]
	public class UsersController : ControllerBase
	{
		private UserManager<ApplicationUser> _userManager;

		public UsersController(UserManager<ApplicationUser> userManager)
		{
			_userManager = userManager;
		}

		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<ApplicationUser>), StatusCodes.Status200OK)]
		public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsersPublic()
		{
			return await _userManager.Users
				.Include(x => x.IndustryPreferences)
				.ToListAsync();
		}

		// api/Users/5
		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(typeof(ApplicationUser), StatusCodes.Status200OK)]
		public async Task<ActionResult<ApplicationUser>> GetUserPublic(string id)
		{
			ApplicationUser? user = await _userManager.Users
				.Include(x => x.IndustryPreferences)
				.Where(user => user.Id == id)
				.FirstOrDefaultAsync();
			if (user == null)
				return NotFound();
			return user;
		}

	}
}
