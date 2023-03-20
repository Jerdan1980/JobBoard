// Copy (implement) GrabKontestsJob for The Muse API
//  You'll prob also have to copy (modify) a method in ApplicationAdoConnection
//		UpsertCompetition() but for Jobs
//		And then the list to single method ig
// If you don't want to do this, just tell me and read through the relevant code
//		I just don't want you to get asked something in the project that you don't know about
//		Also you can have more things you said you did
// I'm fine with debugging lol
// Also yeah setting this up is kinda boring
using JobBoard.Data;
using JobBoard.Models.Jobs;
using JobBoard.Models.Muse;
using Quartz;

namespace JobBoard.QuartzJobs
{
	public class GrabMuseJobJob : IJob
	{
		public static readonly JobKey Key = new JobKey("GrabMuseJob");

		public async Task Execute(IJobExecutionContext context)
		{
			// GET the Job data
			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri("https://www.themuse.com/api/public/");
			client.DefaultRequestHeaders.Accept.Clear();
			client.DefaultRequestHeaders.Accept.Add(
				new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

			int page = context.MergedJobDataMap.GetIntValue("page");
			HttpResponseMessage response = await client.GetAsync($"jobs?page={page}");
			if (!response.IsSuccessStatusCode)
				return;
			//convert from json to Muse object
			var museJobPage = await response.Content.ReadFromJsonAsync<MuseJobPage>();

			//convert from muse object to JobModel object
			List<JobModel> jobs = new List<JobModel>();
			foreach (MuseJob job in museJobPage.Results)
			{
				jobs.Add(job.ToJob());
			}

			//upsert the jobs into the table
			await ApplicationAdoConnection.UpsertJobs(jobs);

			return;
		}
	}
}