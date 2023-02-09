using JobBoard.Models.Muse;
using System.ComponentModel.DataAnnotations;

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
        public string Industry { get; set; }//MuseCategories
        public string Experince { get; set; }  //Muselevels
        public string Company { get; set; }
		public bool External { get; set; }
    }
}
// CNC