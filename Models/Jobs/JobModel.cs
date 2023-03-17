using JobBoard.Models.Industry;
using JobBoard.Models.Tags;
using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Jobs
{
	public class JobModel
    {
        public string Contents { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }  // full-time or part-time
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; } // publication date
		public DateTime ExpirationDate { get; set; }
        public int Id { get; set; }
        public int? Salary { get; set; }
        public string Locations { get; set; }
        public int IndustryId { get; set; } //MuseCategories
		public IndustryModel Industry { get; set; }
        public string Experience { get; set; } //Muselevels
        public string Company { get; set; }
		public bool FromApi { get; set; } //if created by api or rectruiter
		public List<TagModel>? Tags { get; set; } = new List<TagModel>();
    }
}