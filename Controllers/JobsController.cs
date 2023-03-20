using JobBoard.Data;
using JobBoard.Models.Jobs;
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
			return await _context.Jobs
				.Include(x => x.Tags)
				.Include(x => x.Industry)
				.OrderByDescending(job => job.Date)
				.ToListAsync();
		}

		[HttpGet("count")]
		public ActionResult<int> GetJobsCount()
		{
			return _context.Jobs.Count();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<JobModel>> GetJob(int id)
		{
			JobModel? job = await _context.Jobs
				.Include(x => x.Tags)
				.Include(x => x.Industry)
				.Where(job => job.Id == id)
				.FirstOrDefaultAsync();

			return job == null ? NotFound() : Ok(job);
		}

		// Delete
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			JobModel job = _context.Jobs.Find(id);

			if (job == null)
			{
				return NotFound();
			}
			_context.Jobs.Remove(job);
			await _context.SaveChangesAsync();
			return Ok(job);
		}

		//Update
		[HttpPut]
		public async Task<ActionResult<JobModel>> UpdateJob(JobModification model)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			JobModel? job = _context.Jobs
				.Where(j => j.Id == model.Id)
				.FirstOrDefault();

			if (job == null)
				return NotFound();

			job.Contents = model.Contents;
			job.Name = model.Name;
			job.Type = model.Type;
			job.ExpirationDate = model.ExpirationDate;
			job.Salary = model.Salary;
			job.Locations = model.Locations;
			job.Experience = model.Experience;
			job.Company = model.Company;
			job.ApplicationLink = model.ApplicationLink;

			job.Industry = await _context.Industries
				.FindAsync(model.IndustryId);

			if (model.TagIds != null)
			{
				job.Tags = await _context.Tags
				.Where(tag => model.TagIds.Contains(tag.Id))
				.ToListAsync();
			}

			try
			{
				_context.Jobs.Update(job);
				await _context.SaveChangesAsync();
				return Ok(job);
			}
			catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}

		//Create
		[HttpPost]
		public async Task<IActionResult> CreateJob(JobModification model)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			JobModel job = new JobModel()
			{
				Contents = model.Contents,
				Name = model.Name,
				Date = DateTime.Now,
				ExpirationDate = model.ExpirationDate,
				Type = model.Type,
				Salary = model.Salary,
				Locations = model.Locations,
				Experience = model.Experience,
				Company = model.Company,
				Tags = new List<Models.Tags.TagModel>(),
				FromApi = model.FromApi,
				ApplicationLink = model.ApplicationLink,
			};

			job.Industry = await _context.Industries
				.FindAsync(model.IndustryId);

			if (model.TagIds != null)
			{
				job.Tags = await _context.Tags
				.Where(tag => model.TagIds.Contains(tag.Id))
				.ToListAsync();
			}

			try
			{
				_context.Jobs.Add(job);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(CreateJob), new { id = job.Id }, job);
			}
			catch (Exception e)
			{
				return BadRequest(e.Message);
			}
		}

	}
}
