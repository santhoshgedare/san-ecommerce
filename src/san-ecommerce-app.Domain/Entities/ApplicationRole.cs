using Microsoft.AspNetCore.Identity;

namespace SanEcommerceApp.Domain.Entities;

/// <summary>
/// Application role extending ASP.NET Core Identity with additional metadata.
/// </summary>
public class ApplicationRole : IdentityRole<Guid>
{
    /// <summary>Gets or sets the description of the role.</summary>
    public string? Description { get; set; }

    /// <summary>Gets or sets a value indicating whether the role has been soft-deleted.</summary>
    public bool IsDeleted { get; set; }

    /// <summary>Initializes a new instance of the <see cref="ApplicationRole"/> class.</summary>
    public ApplicationRole() : base() { }

    /// <summary>Initializes a new instance of the <see cref="ApplicationRole"/> class with a role name.</summary>
    /// <param name="roleName">The name of the role.</param>
    public ApplicationRole(string roleName) : base(roleName) { }

    /// <summary>Initializes a new instance of the <see cref="ApplicationRole"/> class with a role name and description.</summary>
    /// <param name="roleName">The name of the role.</param>
    /// <param name="description">The description of the role.</param>
    public ApplicationRole(string roleName, string description) : base(roleName)
    {
        Description = description;
    }
}
