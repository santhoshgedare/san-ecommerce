using SanEcommerceApp.Application.Common.Models;
using SanEcommerceApp.Application.DTOs.Auth;

namespace SanEcommerceApp.Application.Services.Interfaces;

/// <summary>
/// Service interface for authentication operations.
/// </summary>
public interface IAuthService
{
    /// <summary>Authenticates a user and returns JWT tokens.</summary>
    Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>Refreshes an access token using a valid refresh token.</summary>
    Task<Result<LoginResponseDto>> RefreshTokenAsync(RefreshTokenRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>Changes the current user's password.</summary>
    Task<Result> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>Initiates the forgot-password flow by generating a reset token.</summary>
    Task<Result<string>> ForgotPasswordAsync(ForgotPasswordRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>Resets a user's password using a valid reset token.</summary>
    Task<Result> ResetPasswordAsync(ResetPasswordRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>Revokes the refresh token for a user, effectively logging them out.</summary>
    Task<Result> RevokeTokenAsync(Guid userId, CancellationToken cancellationToken = default);
}
