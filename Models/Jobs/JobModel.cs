using JobBoard.Models.Industry;
using JobBoard.Models.Muse;
using JobBoard.Models.Tags;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobBoard.Models.Jobs
{
    public class JobModel
    {
        public string Contents { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }  // "external"
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; } // publication date
        public int Id { get; set; }
        public int? Salary { get; set; }
        public string Locations { get; set; }
        public int IndustryId { get; set; } //MuseCategories
		public IndustryModel Industry { get; set; }
        public string Experience { get; set; } //Muselevels
        public string Company { get; set; }
		public bool External { get; set; }
		public List<TagModel> Tags { get; set; } = new List<TagModel>();
    }
}