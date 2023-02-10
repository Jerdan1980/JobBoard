using System.ComponentModel.DataAnnotations;

namespace JobBoard.Models.Industry
{
    public class IndustryModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
