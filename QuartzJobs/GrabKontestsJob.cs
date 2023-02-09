using JobBoard.Data;
using JobBoard.Models.Competitions;
using Quartz;

namespace JobBoard.QuartzJobs
{
	// Implement Quartz.net interface IJob (just has Execute() function)
	public class GrabKontestsJob : IJob
	{
		public static readonly JobKey Key = new JobKey("GrabKontestsJob");

		// Grab Competitions from the Kontests API and UPSERT them
		//		The API returns about 40 competitions with no filtering data or memory
		//		Have to convert from their format to one the app uses
		public async Task Execute(IJobExecutionContext context)
		{
			// GET the Kontests data
			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri("https://kontests.net/api/v1/");
			client.DefaultRequestHeaders.Accept.Clear();
			client.DefaultRequestHeaders.Accept.Add(
				new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			HttpResponseMessage response = await client.GetAsync("all");
			//response.EnsureSuccessStatusCode();
			if (!response.IsSuccessStatusCode)
				return;

			// Convert JSON to Kontest objects
			var kontests = await response.Content.ReadFromJsonAsync<IEnumerable<Kontest>>();

			// Convert Kontest objects to CompetitionModification objects
			List<CompetitionModification> competitions = new List<CompetitionModification>();
			foreach (Kontest kontest in kontests)
			{
				competitions.Add(kontest.ToCompetitionModification());
			}

			// UPSERT the competitions into the AutoCompetitions Table
			await ApplicationAdoConnection.UpsertCompetitions(competitions);

			return;
		}
	}
}
