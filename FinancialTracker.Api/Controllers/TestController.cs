using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinancialTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProtectedData()
        {
            var userName = User.Identity.Name;
            return Ok(new { Message = $"Hello {userName}, you have successfully accessed protected data!" });
        }
    }
}
