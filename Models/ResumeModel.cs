using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models
{
    public class ResumeModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
		//https://stackoverflow.com/questions/2347842/storing-pdf-files-as-binary-objects-in-sql-server-yes-or-no
		//https://www.microsoft.com/en-us/research/wp-content/uploads/2006/04/tr-2006-45.pdf
		public byte[] Data { get; set; }
        [Required]
        public DateTime LastModified { get; set; } = DateTime.Now;

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
