using System.ComponentModel.DataAnnotations;
using JobBoard.Models.Jobs;

namespace JobBoard.Models.Muse
{
    public class MuseJob
    {
		public string Contents { get; set; }
		public string Name { get; set; }
		public string Type { get; set; }  // "external"
		[DataType(DataType.DateTime)]
		public string Publication_Date { get; set; } // conv to DateTime later
		public string Short_Name { get; set; } // url-safe version?
		public string Model_Type { get; set; } // "jobs"
		public int Id { get; set; }
		public List<MuseLocation> Locations { get; set; }
		public List<MuseCategory> Categories { get; set; }
		public List<MuseLevel> Levels { get; set; }
		public List<MuseTag> Tags { get; set; } // Usually empty
		public MuseRef Refs { get; set; }
		public MuseCompany Company { get; set; }

		// Return this object as type JobModel
		//		Allows digestion of The Muse API to in-house SQL
		public JobModel ToJob()
		{
			JobModel job = new JobModel();

			job.Contents = Contents;
			job.Name = Name;
			job.Type = Type;
			job.Date = DateTime.Parse(Publication_Date);
			job.Id = Id;
			job.Locations = Locations[0].Name;
			job.Industry = Categories[0].Name;
			job.Experince = Levels[0].Name;
			job.Company = Company.Name;

			return job;
		}
    }
}

