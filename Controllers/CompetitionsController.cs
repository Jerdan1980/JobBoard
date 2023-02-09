using JobBoard.Data;
using JobBoard.Data.Migrations;
using JobBoard.Models.Competitions;
using JobBoard.Models.Tags;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobBoard.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class CompetitionsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public CompetitionsController(ApplicationDbContext context)
		{
			_context = context;
		}

		// GET: api/Competitions
		[HttpGet]
		public async Task<ActionResult<IEnumerable<CompetitionModel>>> GetCompetitions()
		{
			List<CompetitionModel> competitions = await _context.Competitions
				.Include(x => x.Tags)
				.OrderByDescending(x => x.Id)
				.ToListAsync();

			return Ok(competitions);
		}

		// GET: api/Competitions/5
		[HttpGet("{id}")]
		public async Task<ActionResult<CompetitionModel>> GetCompetition(int id)
		{
			var competition = await _context.Competitions
				.Include(x => x.Tags)
				.Where(comp => comp.Id == id)
				.FirstOrDefaultAsync();

			if (competition == null)
				return NotFound();

			return Ok(competition);
		}

		// DELETE: api/Competitions/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteCompetition(int id)
		{
			CompetitionModel? competition = await _context.Competitions.FindAsync(id);

			if (competition == null)
				return NotFound();

			try
			{
				_context.Competitions.Remove(competition);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		// PUT: api/Competitions
		public async Task<ActionResult<CompetitionModel>> PutCompetition(CompetitionModification model)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);
			
			CompetitionModel? competition = await _context.Competitions
				.Include(x => x.Tags)
				.Where(comp => comp.Id == model.Id)
				.FirstOrDefaultAsync();

			if (competition == null)
				return NotFound();

			competition.Name = model.Name;
			competition.Description = model.Description;
			competition.Automated = model.Automated;
			if (model.StartTime != null)
				competition.StartTime = model.StartTime;
			if (model.EndTime != null)
				competition.EndTime = model.EndTime;

			// Clear tags and then re-add them
			// Frontend has no sense of state to "add" or "remove" tags, only what tags were chosen
			competition.Tags.Clear();
			foreach (int tagId in model.TagIds ?? new int[] { })
			{
				TagModel? tag = await _context.Tags.FindAsync(tagId);
				// ignore any invalid tags
				if (tag != null)
					competition.Tags.Add(tag);
			}

			try
			{
				_context.Update(competition);
				await _context.SaveChangesAsync();
				return Ok(competition);
			}
			catch (Exception ex) 
			{
				return BadRequest(ex);
			}
		}

		// POST: api/Competitions
		[HttpPost]
		public async Task<ActionResult<CompetitionModel>> PostCompetition(CompetitionModification model)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			CompetitionModel competition = new CompetitionModel()
			{
				Id = model.Id,
				Name = model.Name,
				Description = model.Description,
				Tags = new List<TagModel>(),
				Automated = model.Automated
			};

			if (model.StartTime != null)
				competition.StartTime = model.StartTime;
			if (model.EndTime != null)
				competition.EndTime = model.EndTime;

			foreach (int tagId in model.TagIds ?? new int[] { })
			{
				TagModel? tag = await _context.Tags.FindAsync(tagId);
				if (tag != null)
					competition.Tags.Add(tag);
			}

			try
			{
				_context.Competitions.Add(competition);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(PostCompetition), new { id = competition.Id }, competition);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
	}
}
