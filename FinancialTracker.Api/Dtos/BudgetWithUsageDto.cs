namespace FinancialTracker.Api.Dtos
{
    public class BudgetWithUsageDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryColor { get; set; }
        public decimal CurrentSpend { get; set; } 
        public decimal RemainingAmount { get; set; } 
    }
}
