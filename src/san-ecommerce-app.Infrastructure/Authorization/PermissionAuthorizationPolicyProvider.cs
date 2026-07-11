using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using SanEcommerceApp.Application.Security;

namespace SanEcommerceApp.Infrastructure.Authorization;

/// <summary>
/// Dynamically materializes policies for permission-based authorization.
/// </summary>
public sealed class PermissionAuthorizationPolicyProvider : DefaultAuthorizationPolicyProvider
{
    public PermissionAuthorizationPolicyProvider(IOptions<AuthorizationOptions> options)
        : base(options)
    {
    }

    public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (policyName.StartsWith($"{AppPermissions.PolicyPrefix}:", StringComparison.Ordinal))
        {
            var permission = policyName[(AppPermissions.PolicyPrefix.Length + 1)..];
            return new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .AddRequirements(new PermissionRequirement(permission))
                .Build();
        }

        return await base.GetPolicyAsync(policyName);
    }
}
