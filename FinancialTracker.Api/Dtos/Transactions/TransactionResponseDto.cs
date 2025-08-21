using FinancialTracker.Api.Models;

namespace FinancialTracker.Api.Dtos.Transactions
{
    public class TransactionResponseDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public bool IsExpense { get; set; }
        public int CategoryId { get; set; }
        public string UserId { get; set; }

        public string CategoryName { get; set; }
        public string CategoryColor { get; set; }
    }
}