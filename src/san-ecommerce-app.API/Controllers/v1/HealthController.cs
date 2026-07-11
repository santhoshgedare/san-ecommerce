using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace SanEcommerceApp.API.Controllers.v1;

/// <summary>
/// Provides a health check endpoint for monitoring application status.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class HealthController : ControllerBase
{
    /// <summary>Returns the health status of the API.</summary>
    /// <returns>200 OK with health information.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Get() =>
        Ok(new
        {
            status = "Healthy",
            timestamp = DateTimeOffset.UtcNow,
            version = "1.0"
        });
}
