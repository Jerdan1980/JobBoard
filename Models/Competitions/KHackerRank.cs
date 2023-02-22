namespace JobBoard.Models.Competitions
{
	public class KHackerRank : Kontest
	{
		public string Type_ { get; set; } // "Regular" / "College"

		public KHackerRank()
		{
			Site = "HackerRank";
		}

		public override CompetitionModification ToCompetitionModification()
		{
			CompetitionModification competition = base.ToCompetitionModification();

			competition.Description = $"Competition Type: {Type_}\n\n" + competition.Description;
			return competition;
		}
	}
}