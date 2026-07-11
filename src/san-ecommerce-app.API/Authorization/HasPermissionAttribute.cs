using Microsoft.AspNetCore.Authorization;
using SanEcommerceApp.Application.Security;

namespace SanEcommerceApp.API.Authorization;

/// <summary>
/// Applies a permission-based authorization policy.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public sealed class HasPermissionAttribute : AuthorizeAttribute
{
    public HasPermissionAttribute(string permission)
    {
        Permission = permission;
        Policy = AppPermissions.BuildPolicy(permission);
    }

    public string Permission { get; }
}
