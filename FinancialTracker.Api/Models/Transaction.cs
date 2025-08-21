using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialTracker.Api.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public bool IsExpense { get; set; } // True for expenses, false for income

        // Foreign keys
        public int CategoryId { get; set; }
        public string UserId { get; set; } // Foreign key to ApplicationUser

        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}