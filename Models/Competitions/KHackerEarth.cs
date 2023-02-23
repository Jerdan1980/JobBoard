namespace JobBoard.Models.Competitions
{
	public class KHackerEarth : Kontest
	{
		public string Type_ { get; set; } // "Monthly Challenges" / "Hiring Challenges"

		public KHackerEarth()
		{
			Site = "HackerEarth";
		}

		public override CompetitionModification ToCompetitionModification()
		{
			CompetitionModification competition = base.ToCompetitionModification();

			competition.Description = $"Competition Type: {Type_}\n\n" + competition.Description;
			return competition;
		}
	}
}