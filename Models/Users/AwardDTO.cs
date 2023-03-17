namespace JobBoard.Models.Users
{
	public class AwardDTO
	{
		public int Id { get; set; }
		public string Rank { get; set; }

		// User Information
		public string? UserId { get; set; }
		//public PrivacyLevel PrivacyLevel { get; set; }
		public string? UserName { get; set; }

		// Competition Information
		// Try to shorten load times and data usage by grabbing only whats needed
		public int CompetitionId { get; set; }
		public string CompetitionName { get; set; }
		public DateTime CompetitionEndTime { get; set; }
		
	}
}
