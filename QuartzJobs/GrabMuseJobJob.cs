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
    public class GrabMuseJob : IJob
    {
        public static readonly JobKey Key = new JobKey("GrabMuseJob");

        public async Task Execute(IJobExecutionContext context)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://www.themuse.com/api/public/jobs?page=1");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            HttpResponseMessage response = await client.GetAsync("all");
            if(!response.IsSuccessStatusCode)
                return;

            var museJobs = await response.Content.ReadFromJsonAsync<IEnumerable<MuseJob>>();

            List <JobModel> jobs = new List <JobModel>();
            foreach (MuseJob job in museJobs)
            {
                jobs.Add(job.ToJob());
            }

            await ApplicationAdoConnection.UpsertJobs(jobs);
        }
    }
}