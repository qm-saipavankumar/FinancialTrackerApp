using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FinancialTracker.Api.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; } // For UI display

        // Navigation property
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}