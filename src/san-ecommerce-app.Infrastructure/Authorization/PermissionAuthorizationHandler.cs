using Microsoft.AspNetCore.Authorization;
using SanEcommerceApp.Application.Security;

namespace SanEcommerceApp.Infrastructure.Authorization;

/// <summary>
/// Validates that the current principal contains the required permission claim.
/// </summary>
public sealed class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        if (context.User.HasClaim(AppPermissions.ClaimType, requirement.Permission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
