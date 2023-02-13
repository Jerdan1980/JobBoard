using JobBoard.Data;
using JobBoard.Models.Jobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobBoard.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class JobsController : ControllerBase
	{
		public readonly ApplicationDbContext _context;

		public JobsController(ApplicationDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<JobModel>>> GetJobs()
		{
			List<JobModel> jobs = await _context.Jobs
				.Include(x => x.Tags)
				.Include(x => x.Industry)
				.ToListAsync();

			return Ok(jobs);
		}

	}
}
