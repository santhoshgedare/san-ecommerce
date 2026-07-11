namespace SanEcommerceApp.Application.DTOs.Role;

/// <summary>DTO representing a role.</summary>
public class RoleDto
{
    /// <summary>Gets or sets the role identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the role name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the role description.</summary>
    public string? Description { get; set; }
}

/// <summary>DTO for creating a new role.</summary>
public class CreateRoleDto
{
    /// <summary>Gets or sets the role name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Gets or sets the role description.</summary>
    public string? Description { get; set; }
}

/// <summary>DTO for assigning/removing a role to/from a user.</summary>
public class UserRoleDto
{
    /// <summary>Gets or sets the user identifier.</summary>
    public Guid UserId { get; set; }

    /// <summary>Gets or sets the role name.</summary>
    public string RoleName { get; set; } = string.Empty;
}
