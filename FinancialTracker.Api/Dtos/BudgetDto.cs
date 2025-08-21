namespace FinancialTracker.Api.Dtos
{
    public class BudgetDto
    {
        public decimal Amount { get; set; }
        public int CategoryId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
