using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinancialTracker.Api.Data;
using FinancialTracker.Api.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq;
using FinancialTracker.Api.Dtos.Dashboard;

namespace FinancialTracker.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }


        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var userId = GetUserId();

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId)
                .ToListAsync();

            var totalIncome = transactions
                .Where(t => !t.IsExpense)
                .Sum(t => t.Amount);

            var totalExpenses = transactions
                .Where(t => t.IsExpense)
                .Sum(t => t.Amount);

            var summary = new DashboardSummaryDto
            {
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                NetBalance = totalIncome - totalExpenses
            };

            return Ok(summary);
        }

        [HttpGet("expenses-by-category")]
        public async Task<ActionResult<IEnumerable<CategoryExpensesDto>>> GetExpensesByCategory()
        {
            var userId = GetUserId();

            var expensesByCategory = await _context.Transactions
                .Where(t => t.UserId == userId && t.IsExpense)
                .GroupBy(t => t.Category)
                .Select(g => new CategoryExpensesDto
                {
                    CategoryName = g.Key.Name,
                    CategoryColor = g.Key.Color,
                    TotalAmount = g.Sum(t => t.Amount)
                })
                .ToListAsync();

            return Ok(expensesByCategory);
        }

        [HttpGet("monthly-summary")]
        public async Task<ActionResult<IEnumerable<MonthlySummaryDto>>> GetMonthlySummary()
        {
            var userId = GetUserId();

            // Perform grouping and summing in the database
            var rawMonthlyData = await _context.Transactions
                .Where(t => t.UserId == userId)
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    TotalIncome = g.Where(t => !t.IsExpense).Sum(t => t.Amount),
                    TotalExpenses = g.Where(t => t.IsExpense).Sum(t => t.Amount)
                })
                .ToListAsync(); // Bring data to memory here

            // Now, perform formatting and ordering in C# (in-memory)
            var monthlyData = rawMonthlyData
                .Select(m => new MonthlySummaryDto
                {
                    MonthYear = new DateTime(m.Year, m.Month, 1).ToString("MMM yyyy"), // Format in C#
                    TotalIncome = m.TotalIncome,
                    TotalExpenses = m.TotalExpenses
                })
                .OrderBy(m => DateTime.ParseExact(m.MonthYear, "MMM yyyy", null)) // Order by actual date value
                .ToList();

            return Ok(monthlyData);
        }


        [HttpGet("current-month-summary")]
        public async Task<ActionResult<MonthlyFinancialSummaryDto>> GetCurrentMonthSummary() 
        {
            var userId = GetUserId();
            var now = DateTime.UtcNow; // Use UtcNow for consistency
            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59); // End of current month

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.Date >= startOfMonth && t.Date <= endOfMonth)
                .ToListAsync();

            var income = transactions.Where(t => !t.IsExpense).Sum(t => t.Amount);
            var expenses = transactions.Where(t => t.IsExpense).Sum(t => t.Amount);

            return Ok(new MonthlyFinancialSummaryDto
            {
                TotalIncome = income,
                TotalExpenses = expenses,
                NetBalance = income - expenses
            });
        }


        [HttpGet("last-month-summary")]
        public async Task<ActionResult<MonthlyFinancialSummaryDto>> GetLastMonthSummary()
        {
            var userId = GetUserId();
            var now = DateTime.UtcNow;
            var startOfLastMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-1);
            var endOfLastMonth = startOfLastMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59); // End of last month

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.Date >= startOfLastMonth && t.Date <= endOfLastMonth)
                .ToListAsync();

            var income = transactions.Where(t => !t.IsExpense).Sum(t => t.Amount);
            var expenses = transactions.Where(t => t.IsExpense).Sum(t => t.Amount);

            return Ok(new MonthlyFinancialSummaryDto
            {
                TotalIncome = income,
                TotalExpenses = expenses,
                NetBalance = income - expenses
            });
        }

    }
}