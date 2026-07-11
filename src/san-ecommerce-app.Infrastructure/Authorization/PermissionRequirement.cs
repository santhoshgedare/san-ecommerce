using Microsoft.AspNetCore.Authorization;

namespace SanEcommerceApp.Infrastructure.Authorization;

/// <summary>
/// Authorization requirement for a single permission.
/// </summary>
public sealed class PermissionRequirement(string permission) : IAuthorizationRequirement
{
    public string Permission { get; } = permission;
}
