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

		static readonly int COMPUTERSCIENCE_TAGID = 1;
		static readonly Dictionary<string, int> SITE_TAGIDS = new Dictionary<string, int>();
		static Kontest()
		{
			SITE_TAGIDS.Clear();
			SITE_TAGIDS.Add("CodeForces",		2	);
			SITE_TAGIDS.Add("CodeForces::Gym",	3	);
			SITE_TAGIDS.Add("TopCoder",			4	);
			SITE_TAGIDS.Add("AtCoder",			5	);
			SITE_TAGIDS.Add("CS Academy",		6	);
			SITE_TAGIDS.Add("CodeChef",			7	);
			SITE_TAGIDS.Add("HackerRank",		8	);
			SITE_TAGIDS.Add("HackerEarth",		9	);
			SITE_TAGIDS.Add("Kick Start",		10	);
			SITE_TAGIDS.Add("LeetCode",			11	);
			SITE_TAGIDS.Add("Toph",				12	);
		}

		public CompetitionModification ToCompetitionModification()
		{
			CompetitionModification competition = new CompetitionModification()
			{
				Name = Name,
				Description = $"Hosted at: {Url}",
				StartTime = null,
				EndTime = null,
				TagIds = new int[] { COMPUTERSCIENCE_TAGID, SITE_TAGIDS[Site] },
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
