using FinancialTracker.Api.Data;
using FinancialTracker.Api.Dtos;
using FinancialTracker.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FinancialTracker.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BudgetController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetWithUsageDto>>> GetBudgetsWithUsage()
        {
            var userId = GetUserId();

            var budgets = await _context.Budgets
                .Where(b => b.UserId == userId)
                .Include(b => b.Category)
                .ToListAsync();

            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId && t.IsExpense)
                .ToListAsync();

            var budgetsWithUsage = new List<BudgetWithUsageDto>();

            foreach (var budget in budgets)
            {
                var currentSpend = transactions
                    .Where(t => t.CategoryId == budget.CategoryId && t.Date >= budget.StartDate && t.Date <= budget.EndDate)
                    .Sum(t => t.Amount);

                budgetsWithUsage.Add(new BudgetWithUsageDto
                {
                    Id = budget.Id,
                    Amount = budget.Amount,
                    StartDate = budget.StartDate,
                    EndDate = budget.EndDate,
                    CategoryId = budget.CategoryId,
                    CategoryName = budget.Category.Name,
                    CategoryColor = budget.Category.Color,
                    CurrentSpend = currentSpend,
                    RemainingAmount = budget.Amount - currentSpend
                });
            }

            return Ok(budgetsWithUsage);
        }


        [HttpPost]
        public async Task<ActionResult<Budget>> PostBudget(BudgetDto budgetDto)
        {
            var userId = GetUserId();
            var budget = new Budget
            {
                Amount = budgetDto.Amount,
                CategoryId = budgetDto.CategoryId,
                StartDate = budgetDto.StartDate,
                EndDate = budgetDto.EndDate,
                UserId = userId
            };
            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBudgetsWithUsage), new { id = budget.Id }, budget);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget(int id, BudgetDto budgetDto)
        {
            var userId = GetUserId();
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null)
            {
                return NotFound();
            }

            budget.Amount = budgetDto.Amount;
            budget.CategoryId = budgetDto.CategoryId;
            budget.StartDate = budgetDto.StartDate;
            budget.EndDate = budgetDto.EndDate;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetExists(id, userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var userId = GetUserId();
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null)
            {
                return NotFound();
            }

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BudgetExists(int id, string userId)
        {
            return _context.Budgets.Any(e => e.Id == id && e.UserId == userId);
        }
    }
}
