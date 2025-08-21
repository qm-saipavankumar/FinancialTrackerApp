using System.ComponentModel.DataAnnotations;

namespace FinancialTracker.Api.Dtos.Transactions
{
    public class TransactionDto
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public bool IsExpense { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}