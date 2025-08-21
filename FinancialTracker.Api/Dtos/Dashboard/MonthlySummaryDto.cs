namespace FinancialTracker.Api.Dtos.Dashboard
{
    public class MonthlySummaryDto
    {
        public string MonthYear { get; set; } 
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
    }
}
