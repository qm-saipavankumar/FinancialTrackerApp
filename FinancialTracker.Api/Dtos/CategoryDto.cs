using System.ComponentModel.DataAnnotations;

namespace FinancialTracker.Api.Dtos
{
    public class CategoryDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }

        [Required]
        public string Color { get; set; } // e.g., a hex code like "#FF5733"
    }
}