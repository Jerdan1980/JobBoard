using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Tags
{
	// Allows easy modification of Tags, mainly for automated/postman use
	// Might need a separate "force tag ids" if put on frontend
	public class TagModification
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Name { get; set; } = string.Empty;
		public string? Description { get; set; }

		public int[]? AddIds { get; set; }
		public int[]? RemoveIds { get; set; }
	}
}
