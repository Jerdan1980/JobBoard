using JobBoard.Data;
using JobBoard.Models.Industry;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobBoard.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class IndustriesController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public IndustriesController(ApplicationDbContext context)
		{
			_context = context;
		}

		// GET: api/Industries
		[HttpGet]
		public async Task<ActionResult<IEnumerable<IndustryModel>>> GetIndustries()
		{
			List<IndustryModel> industries = await _context.Industries
				.ToListAsync();

			return Ok(industries);
		}

		[HttpGet("count")]
		public async Task<ActionResult<IEnumerable<IndustryCount>>> GetIndustriesCount()
		{
			IQueryable<IndustryCount> data =
				from industry in _context.Industries
				join job in _context.Jobs
				on industry.Id equals job.IndustryId into industryGroup
				orderby industryGroup.Count() descending
				select new IndustryCount
				{
					Id = industry.Id,
					Name = industry.Name,
					Count = industryGroup.Count()
				};

			return await data.ToListAsync();
		}
	}
}
