using System.ComponentModel.DataAnnotations;
using JobBoard.Data.Migrations;
using JobBoard.Models.Industry;
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
			try
			{
				JobModel job = new JobModel();

				job.Contents = Contents;
				job.Name = Name;
				job.Type = "Unknown";
				job.Date = DateTime.Parse(Publication_Date);
				job.ExpirationDate = job.Date.AddDays(30);
				job.Id = Id;

				// Turns out sometimes Locations are empty
				if (Locations.Count > 0)
				{
					job.Locations = Locations[0].Name;
				}
				else
					job.Locations = "N/A";

				// Industries holds a dictionary of names and ids
				// Sometimes Categories is empty
				if (Categories.Count > 0)
					job.IndustryId = Industries.Ids[Categories[0].Name];
				else
					job.IndustryId = Industries.Ids["Unknown"];

				job.Experience = Levels[0].Name;
				job.Company = Company.Name;
				job.FromApi = true;

				return job;
			}
			catch (Exception ex)
			{
				return null;
			}
		}
	}
}

