using JobBoard.Models;
using JobBoard.Models.Roles;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//https://www.yogihosting.com/aspnet-core-identity-roles/#all-roles
namespace JobBoard.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class RolesController : ControllerBase
	{
		private RoleManager<IdentityRole> _roleManager;
		private UserManager<ApplicationUser> _userManager;

		public RolesController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
		{
			_roleManager = roleManager;
			_userManager = userManager;
		}

		// Get: api/Roles
		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<IdentityRole>), StatusCodes.Status200OK)]
		public async Task<ActionResult<IEnumerable<IdentityRole>>> Get()
		{
			return await _roleManager.Roles.ToListAsync();
		}

		// Post: api/Roles
		// Creates a role from a name
		[HttpPost]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<IActionResult> Create([FromBody] CreateRole body)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			IdentityResult result = await _roleManager.CreateAsync(new IdentityRole(body.Name));
			if (result.Succeeded)
				return NoContent();
			return BadRequest(result);
		}

		// Delete: api/Roles/5
		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<IActionResult> Delete(string id)
		{
			IdentityRole? role = await _roleManager.FindByIdAsync(id);
			if (role == null)
				return NotFound();

			IdentityResult result = await _roleManager.DeleteAsync(role);
			if (result.Succeeded)
				return NoContent();
			return BadRequest(result);
		}

		// Get: api/Roles/5
		// Gets a single role and returns its roleDTO (role, members w/, members w/o)
		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(typeof(RoleDTO), StatusCodes.Status200OK)]
		public async Task<ActionResult<RoleDTO>> Get(string id)
		{
			IdentityRole? role = await _roleManager.FindByIdAsync(id);
			if (role == null)
				return NotFound();

			List<ApplicationUser> members = new List<ApplicationUser>();
			List<ApplicationUser> nonMembers = new List<ApplicationUser>();

			foreach (ApplicationUser user in _userManager.Users)
			{
				var list = await _userManager.IsInRoleAsync(user, role.Name) ? members : nonMembers;
				list.Add(user);
			}

			return new RoleDTO
			{
				Role = role,
				Members = members,
				NonMembers = nonMembers,
			};
		}

		// Put: api/Roles
		// Updates a role based on the RoleModification sent
		[HttpPut]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<IActionResult> Update(RoleModification model)
		{
			IdentityResult result;
			if (!ModelState.IsValid)
				return BadRequest();

			foreach (string userId in model.AddIds ?? new string[] { })
			{
				ApplicationUser? user = await _userManager.FindByIdAsync(userId);
				if (user != null)
				{
					result = await _userManager.AddToRoleAsync(user, model.RoleName);
					if (!result.Succeeded)
						return BadRequest(result);
				}
			}

			foreach (string userId in model.RemoveIds ?? new string[] { })
			{
				ApplicationUser? user = await _userManager.FindByIdAsync(userId);
				if (user != null)
				{
					result = await _userManager.RemoveFromRoleAsync(user, model.RoleName);
					if (!result.Succeeded)
						return BadRequest(result);
				}
			}

			return NoContent();
		}
	}
}
