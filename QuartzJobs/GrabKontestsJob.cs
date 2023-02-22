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
			// Setup the HTTPClient for Kontests data
			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri("https://kontests.net/api/v1/");
			client.DefaultRequestHeaders.Accept.Clear();
			client.DefaultRequestHeaders.Accept.Add(
				new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			// This grabs the data using its url and then saves it to the database using the ToCompetitionModification() function
			// Requires the generic to inherit from Kontest (becuase an interface wasn't made)
			await DigestData<Kontest>(client, "all");
			await DigestData<KAtCoder>(client, "at_coder");
			await DigestData<KHackerEarth>(client, "hacker_earth");
			await DigestData<KHackerRank>(client, "hacker_rank");

			return;
		}

		//https://stackoverflow.com/questions/39659145/t-does-not-contain-a-definition
		// SO says it has to be an interface but you can use a class also
		private async Task DigestData<T>(HttpClient client, string url)
			where T : Kontest
		{
			try
			{
				HttpResponseMessage response = await client.GetAsync(url);
				if (!response.IsSuccessStatusCode)
					return;

				// Convert JSON to Kontest objects
				var kontests = await response.Content.ReadFromJsonAsync<IEnumerable<T>>();

				// Convert Kontest objects to CompetitionModification objects
				List<CompetitionModification> competitions = new List<CompetitionModification>();
				foreach (T kontest in kontests)
				{
					competitions.Add(kontest.ToCompetitionModification());
				}

				// UPSERT the competitions into the AutoCompetitions Table
				await ApplicationAdoConnection.UpsertCompetitions(competitions);
			}
			catch (Exception ex)
			{
				return;
			}
		}
	}
}
