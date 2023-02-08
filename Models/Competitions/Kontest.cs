namespace JobBoard.Models.Competitions
{
	public class Kontest
	{
		public string Name { get; set; }
		public string Url { get; set; }
		public string Start_Time { get; set; }
		public string End_Time { get; set; }
		public double Duration { get; set; }
		public string Site { get; set; }
		public string In_24_Hours { get; set; } // YES/NO
		public string Status { get; set; } // BEFORE/CODING

		static readonly int COMPUTERSCIENCE_TAGID = 5;
		static readonly Dictionary<string, int> SITE_TAGIDS = new Dictionary<string, int>();
		static Kontest()
		{
			SITE_TAGIDS.Clear();
			SITE_TAGIDS.Add("CodeForces", 6);
			SITE_TAGIDS.Add("CodeForces::Gym", 7);
			SITE_TAGIDS.Add("TopCoder", 8);
			SITE_TAGIDS.Add("AtCoder", 9);
			SITE_TAGIDS.Add("CS Academy", 10);
			SITE_TAGIDS.Add("CodeChef", 11);
			SITE_TAGIDS.Add("HackerRank", 12);
			SITE_TAGIDS.Add("HackerEarth", 13);
			SITE_TAGIDS.Add("Kick Start", 14);
			SITE_TAGIDS.Add("LeetCode", 15);
			SITE_TAGIDS.Add("Toph", 16);
		}

		public CompetitionModel ToCompetition()
		{
			CompetitionModel competition = new CompetitionModel()
			{
				Name = Name,
				Description = $"Hosted at: {Url}",
				StartTime = null,
				EndTime = null,
				TagIds = new List<int> { COMPUTERSCIENCE_TAGID, SITE_TAGIDS[Site] },
				Automated = true
			};

			if (DateTime.TryParse(Start_Time, out DateTime start_time))
				competition.StartTime = start_time;
			if (DateTime.TryParse(End_Time, out DateTime end_time))
				competition.EndTime = end_time;

			return competition;
		}
	}
}
