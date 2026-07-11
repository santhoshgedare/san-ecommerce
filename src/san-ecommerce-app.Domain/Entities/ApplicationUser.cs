using Microsoft.AspNetCore.Identity;

namespace SanEcommerceApp.Domain.Entities;

/// <summary>
/// Application user extending ASP.NET Core Identity with additional profile fields.
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    /// <summary>Gets or sets the user's first name.</summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>Gets or sets the user's last name.</summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>Gets or sets the employee code.</summary>
    public string? EmployeeCode { get; set; }

    /// <summary>Gets or sets the department the user belongs to.</summary>
    public string? Department { get; set; }

    /// <summary>Gets or sets the URL or path of the profile image.</summary>
    public string? ProfileImage { get; set; }

    /// <summary>Gets or sets a value indicating whether the account is active.</summary>
    public bool IsActive { get; set; } = true;

    /// <summary>Gets or sets a value indicating whether the user has been soft-deleted.</summary>
    public bool IsDeleted { get; set; }

    /// <summary>Gets or sets the date and time the user was deleted.</summary>
    public DateTime? DeletedOn { get; set; }

    /// <summary>Gets or sets the user who performed the deletion.</summary>
    public string? DeletedBy { get; set; }

    /// <summary>Gets or sets the date and time the user was created.</summary>
    public DateTime CreatedOn { get; set; }

    /// <summary>Gets or sets the user who created this account.</summary>
    public string CreatedBy { get; set; } = string.Empty;

    /// <summary>Gets or sets the date and time the user record was last modified.</summary>
    public DateTime? ModifiedOn { get; set; }

    /// <summary>Gets or sets the user who last modified this record.</summary>
    public string? ModifiedBy { get; set; }

    /// <summary>Gets or sets the refresh token for JWT authentication.</summary>
    public string? RefreshToken { get; set; }

    /// <summary>Gets or sets the expiry date of the refresh token.</summary>
    public DateTime? RefreshTokenExpiryTime { get; set; }

    /// <summary>Gets or sets the row version for optimistic concurrency control.</summary>
    public byte[] RowVersion { get; set; } = [];

    /// <summary>Gets the user's full name.</summary>
    public string FullName => $"{FirstName} {LastName}".Trim();
}
