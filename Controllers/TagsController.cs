using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobBoard.Data;
using JobBoard.Models.Tags;
using JobBoard.Models.Competitions;
using JobBoard.Models.Industry;

namespace JobBoard.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TagsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public TagsController(ApplicationDbContext context)
		{
			_context = context;
		}

		// GET: api/Tags
		[HttpGet]
		public async Task<ActionResult<IEnumerable<TagModel>>> GetTags()
		{
			//https://stackoverflow.com/questions/72457759/net-6-entity-framework-core-many-to-many-relationships	
			return await _context.Tags
				.Include(x => x.Competitions)
				.Include(x => x.Jobs)
				.ToListAsync();
		}
		
		[HttpGet("count")]
		public ActionResult<int> GetTagsCount()
		{
			return _context.Tags.Count();
		}

		[HttpGet("min")]
		public async Task<ActionResult<IEnumerable<TagCount>>> GetTagsMin()
		{
			List<TagCount> data = await _context.Tags
				.Include(x => x.Competitions)
				.OrderByDescending(tag => tag.Competitions.Count())
				.Select(tag => new TagCount
				{
					Id = tag.Id,
					Name = tag.Name,
					Count = tag.Competitions.Count()
				}).ToListAsync();

			return data;
		}

		// GET: api/Tags/5
		[HttpGet("{id}")]
		public async Task<ActionResult<TagModel>> GetTag(int id)
		{
			TagModel? tag = await _context.Tags
				.Include(x => x.Competitions)
				.Include(x => x.Jobs)
				.Where(tag => tag.Id == id)
				.FirstOrDefaultAsync();

			if (tag == null)
				return NotFound();
			return Ok(tag);
		}

		// DELETE: api/Tags/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTag(int id)
		{
			if (_context.Tags == null)
				return NotFound();
			TagModel? tag = await _context.Tags.FindAsync(id);
			if (tag == null)
				return NotFound();

			try
			{
				_context.Tags.Remove(tag);
				await _context.SaveChangesAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		// PUT: api/Tags/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut]
        public async Task<IActionResult> PutTag(TagModification model)
        {
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			TagModel? tag = await _context.Tags
				.Include(x => x.Competitions)
				.Where(tag => tag.Id == model.Id)
				.FirstOrDefaultAsync();

			if (tag == null)
				return NotFound();

			tag.Name = model.Name;
			tag.Description = model.Description;

			// Redo competitions join if present
			if (model.CompetitionIds?.Length > 0)
			{
				tag.Competitions.Clear();
				foreach (int compId in model.CompetitionIds)
				{
					CompetitionModel? comp = await _context.Competitions.FindAsync(compId);
					if (comp != null)
						tag.Competitions.Add(comp);
				}
			}
			
			// Redo Jobs join if present
			if (model.JobIds?.Length > 0)
			{
				tag.Jobs.Clear();
				foreach (int compId in model.JobIds)
				{
					CompetitionModel? comp = await _context.Competitions.FindAsync(compId);
					if (comp != null)
						tag.Competitions.Remove(comp);
				}
			}

			try
			{
				_context.Update(tag);
				await _context.SaveChangesAsync();
				return Ok(tag);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

        // POST: api/Tags
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TagModel>> PostTag(TagModel tag)
        {
			if (!ModelState.IsValid)
				return NotFound();

			try
			{
				_context.Tags.Add(tag);
				await _context.SaveChangesAsync();
				return CreatedAtAction(nameof(PostTag), new { id = tag.Id }, tag);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
        }
    }
}
