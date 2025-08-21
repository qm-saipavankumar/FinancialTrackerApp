namespace FinancialTracker.Api.Dtos.Dashboard
{
    public class MonthlyFinancialSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetBalance { get; set; }
    }
}
