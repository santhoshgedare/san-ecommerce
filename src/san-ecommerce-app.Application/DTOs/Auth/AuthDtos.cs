namespace SanEcommerceApp.Application.DTOs.Auth;

/// <summary>Request DTO for user login.</summary>
public class LoginRequestDto
{
    /// <summary>Gets or sets the user's email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the user's password.</summary>
    public string Password { get; set; } = string.Empty;
}

/// <summary>Response DTO returned after a successful login.</summary>
public class LoginResponseDto
{
    /// <summary>Gets or sets the JWT access token.</summary>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>Gets or sets the refresh token.</summary>
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>Gets or sets the access token expiry date/time (UTC).</summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>Gets or sets the user's identifier.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the user's email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the user's full name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the roles assigned to the user.</summary>
    public IEnumerable<string> Roles { get; set; } = [];

    /// <summary>Gets or sets the effective permissions granted to the user.</summary>
    public IEnumerable<string> Permissions { get; set; } = [];
}

/// <summary>Request DTO for refreshing a JWT token.</summary>
public class RefreshTokenRequestDto
{
    /// <summary>Gets or sets the expired access token.</summary>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>Gets or sets the refresh token.</summary>
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>Request DTO for changing a user's password.</summary>
public class ChangePasswordRequestDto
{
    /// <summary>Gets or sets the current password.</summary>
    public string CurrentPassword { get; set; } = string.Empty;

    /// <summary>Gets or sets the new password.</summary>
    public string NewPassword { get; set; } = string.Empty;

    /// <summary>Gets or sets the confirmation of the new password.</summary>
    public string ConfirmNewPassword { get; set; } = string.Empty;
}

/// <summary>Request DTO for initiating a forgot-password flow.</summary>
public class ForgotPasswordRequestDto
{
    /// <summary>Gets or sets the email address to send the reset link to.</summary>
    public string Email { get; set; } = string.Empty;
}

/// <summary>Request DTO for resetting a password using a token.</summary>
public class ResetPasswordRequestDto
{
    /// <summary>Gets or sets the email address of the user.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the password reset token.</summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>Gets or sets the new password.</summary>
    public string NewPassword { get; set; } = string.Empty;

    /// <summary>Gets or sets the confirmation of the new password.</summary>
    public string ConfirmNewPassword { get; set; } = string.Empty;
}
