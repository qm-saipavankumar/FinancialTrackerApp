using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialTracker.Api.Models
{
    public class Budget
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Foreign keys
        public int CategoryId { get; set; }
        public string UserId { get; set; } // Foreign key to ApplicationUser

        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}