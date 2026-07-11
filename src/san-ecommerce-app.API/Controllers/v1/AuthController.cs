using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using SanEcommerceApp.Application.Common.Models;
using SanEcommerceApp.Application.DTOs.Auth;
using SanEcommerceApp.Application.Services.Interfaces;

namespace SanEcommerceApp.API.Controllers.v1;

/// <summary>
/// Handles authentication operations including login, token refresh, and password management.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthController"/> class.
    /// </summary>
    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>Authenticates a user and returns JWT tokens.</summary>
    /// <param name="request">The login credentials.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>JWT access and refresh tokens on success.</returns>
    /// <response code="200">Login successful.</response>
    /// <response code="400">Invalid request.</response>
    /// <response code="401">Invalid credentials or account locked.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(request, cancellationToken);

        if (result.IsFailure)
        {
            _logger.LogWarning("Login failed for email: {Email}", request.Email);
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Authentication Failed",
                Detail = result.ErrorMessage
            });
        }

        return Ok(result.Data);
    }

    /// <summary>Refreshes an expired JWT access token using a valid refresh token.</summary>
    /// <param name="request">The expired access token and refresh token.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>New access and refresh tokens.</returns>
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RefreshToken(
        [FromBody] RefreshTokenRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.RefreshTokenAsync(request, cancellationToken);

        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Token Refresh Failed",
                Detail = result.ErrorMessage
            });

        return Ok(result.Data);
    }

    /// <summary>Changes the authenticated user's password.</summary>
    /// <param name="request">The current and new password.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPost("change-password")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequestDto request,
        CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _authService.ChangePasswordAsync(userId, request, cancellationToken);

        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Password Change Failed",
                Detail = result.ErrorMessage
            });

        return Ok(new { message = "Password changed successfully." });
    }

    /// <summary>Initiates the forgot-password flow by generating a reset token.</summary>
    /// <param name="request">The email address of the user.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.ForgotPasswordAsync(request, cancellationToken);

        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Forgot Password Failed",
                Detail = result.ErrorMessage
            });

        // In production, send the token via email. Here we return a success message.
        return Ok(new { message = result.Data });
    }

    /// <summary>Resets a user's password using a valid reset token.</summary>
    /// <param name="request">The email, reset token, and new password.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.ResetPasswordAsync(request, cancellationToken);

        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Password Reset Failed",
                Detail = result.ErrorMessage
            });

        return Ok(new { message = "Password reset successfully." });
    }

    /// <summary>Revokes the current user's refresh token (logout).</summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPost("revoke-token")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RevokeToken(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        await _authService.RevokeTokenAsync(userId, cancellationToken);
        return Ok(new { message = "Token revoked successfully." });
    }
}
