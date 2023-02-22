namespace JobBoard.Models.Competitions
{
	public class KAtCoder : Kontest
	{
		public string Rated_Range { get; set; }

		public KAtCoder()
		{
			Site = "AtCoder";
		}

		public override CompetitionModification ToCompetitionModification()
		{
			CompetitionModification competition =  base.ToCompetitionModification();

			if (Rated_Range.StartsWith(" - "))
				Rated_Range = "0" + Rated_Range;
			else if (Rated_Range == "-")
				Rated_Range = "TBD";

			competition.Description = $"Rated Range: {Rated_Range}\n\n" + competition.Description;
			return competition;
		}
	}
}