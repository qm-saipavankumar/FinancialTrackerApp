using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinancialTracker.Api.Data;
using FinancialTracker.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinancialTracker.Api.Dtos.Transactions;

namespace FinancialTracker.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // A helper method to get the ID of the current authenticated user.
        private string GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }

        // GET: api/Transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetTransactions()
        {
            var userId = GetUserId();
            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId) // Filter by the current user
                .Include(t => t.Category) // Include the related category data
                .OrderByDescending(t => t.Date) // Order by date for a better user experience
                .Select(t => new TransactionResponseDto
                {
                    Id = t.Id,
                    Description = t.Description,
                    Amount = t.Amount,
                    Date = t.Date,
                    IsExpense = t.IsExpense,
                    CategoryId = t.CategoryId,
                    UserId = t.UserId,
                    CategoryName = t.Category.Name,
                    CategoryColor = t.Category.Color
                })
                .ToListAsync();

            return Ok(transactions);
        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionResponseDto>> GetTransaction(int id)
        {
            var userId = GetUserId();
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId); // Ensure it belongs to the user

            if (transaction == null)
            {
                return NotFound();
            }

            var responseDto = new TransactionResponseDto
            {
                Id = transaction.Id,
                Description = transaction.Description,
                Amount = transaction.Amount,
                Date = transaction.Date,
                IsExpense = transaction.IsExpense,
                CategoryId = transaction.CategoryId,
                UserId = transaction.UserId,
                CategoryName = transaction.Category.Name,
                CategoryColor = transaction.Category.Color
            };

            return Ok(responseDto);
        }

        // POST: api/Transactions
        [HttpPost]
        public async Task<ActionResult<TransactionResponseDto>> PostTransaction(TransactionDto transactionDto)
        {
            var userId = GetUserId();
            var transaction = new Transaction
            {
                Description = transactionDto.Description,
                Amount = transactionDto.Amount,
                Date = DateTime.SpecifyKind(transactionDto.Date, DateTimeKind.Utc),
                IsExpense = transactionDto.IsExpense,
                CategoryId = transactionDto.CategoryId,
                UserId = userId
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            // To return the full object with category info
            var savedTransaction = await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == transaction.Id);

            var responseDto = new TransactionResponseDto
            {
                Id = savedTransaction.Id,
                Description = savedTransaction.Description,
                Amount = savedTransaction.Amount,
                Date = savedTransaction.Date,
                IsExpense = savedTransaction.IsExpense,
                CategoryId = savedTransaction.CategoryId,
                UserId = savedTransaction.UserId,
                CategoryName = savedTransaction.Category.Name,
                CategoryColor = savedTransaction.Category.Color
            };

            return CreatedAtAction(nameof(GetTransaction), new { id = savedTransaction.Id }, responseDto);
        }

        // PUT: api/Transactions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, TransactionDto transactionDto)
        {
            var userId = GetUserId();
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
            {
                return NotFound();
            }

            transaction.Description = transactionDto.Description;
            transaction.Amount = transactionDto.Amount;
            transaction.Date = transactionDto.Date;
            transaction.IsExpense = transactionDto.IsExpense;
            transaction.CategoryId = transactionDto.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id, userId))
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

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var userId = GetUserId();
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionExists(int id, string userId)
        {
            return _context.Transactions.Any(e => e.Id == id && e.UserId == userId);
        }
    }
}