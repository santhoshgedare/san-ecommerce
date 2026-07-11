namespace SanEcommerceApp.Infrastructure.Services;

/// <summary>
/// Strongly-typed options for JWT configuration.
/// </summary>
public class JwtSettings
{
    /// <summary>The configuration section key.</summary>
    public const string SectionName = "JwtSettings";

    /// <summary>Gets or sets the signing secret key.</summary>
    public string SecretKey { get; set; } = string.Empty;

    /// <summary>Gets or sets the token issuer.</summary>
    public string Issuer { get; set; } = string.Empty;

    /// <summary>Gets or sets the token audience.</summary>
    public string Audience { get; set; } = string.Empty;

    /// <summary>Gets or sets the access token expiry in minutes.</summary>
    public int ExpiryMinutes { get; set; } = 60;

    /// <summary>Gets or sets the refresh token expiry in days.</summary>
    public int RefreshTokenExpiryDays { get; set; } = 7;
}
