namespace FinancialTracker.Api.Dtos.Dashboard
{
    public class DashboardSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetBalance { get; set; }
    }
}
