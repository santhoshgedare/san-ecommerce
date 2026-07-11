using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SanEcommerceApp.Application.Security;
using SanEcommerceApp.Domain.Entities;
using SanEcommerceApp.Infrastructure.Options;

namespace SanEcommerceApp.Infrastructure.Data;

/// <summary>
/// Seeds initial data (roles and admin user) into the database.
/// </summary>
public static class DatabaseSeeder
{
    /// <summary>
    /// Seeds the database with default roles and an admin user.
    /// </summary>
    /// <param name="serviceProvider">The service provider to resolve dependencies from.</param>
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();
        var adminOptions = scope.ServiceProvider.GetRequiredService<IOptions<AdminSeedOptions>>().Value;

        await SeedRolesAsync(roleManager, logger);
        await SeedAdminUserAsync(userManager, logger, adminOptions);
    }

    private static async Task SeedRolesAsync(
        RoleManager<ApplicationRole> roleManager,
        ILogger logger)
    {
        foreach (var (roleName, permissions) in AppPermissions.DefaultRolePermissions)
        {
            var existingRole = await roleManager.FindByNameAsync(roleName);
            if (existingRole is null)
            {
                var role = new ApplicationRole(roleName, $"Default {roleName} role")
                {
                    Permissions = permissions.ToList()
                };
                var result = await roleManager.CreateAsync(role);
                if (result.Succeeded)
                    logger.LogInformation("Seeded role: {RoleName}", roleName);
                else
                    logger.LogWarning("Failed to seed role {RoleName}: {Errors}", roleName,
                        string.Join(", ", result.Errors.Select(e => e.Description)));
            }
            else
            {
                var expectedPermissions = permissions.OrderBy(permission => permission).ToArray();
                var currentPermissions = existingRole.Permissions.OrderBy(permission => permission).ToArray();
                if (!expectedPermissions.SequenceEqual(currentPermissions, StringComparer.Ordinal))
                {
                    existingRole.Permissions = permissions.ToList();
                    var updateResult = await roleManager.UpdateAsync(existingRole);
                    if (updateResult.Succeeded)
                        logger.LogInformation("Updated permissions for seeded role: {RoleName}", roleName);
                    else
                        logger.LogWarning("Failed to update seeded role {RoleName}: {Errors}", roleName,
                            string.Join(", ", updateResult.Errors.Select(e => e.Description)));
                }
            }
        }
    }

    private static async Task SeedAdminUserAsync(
        UserManager<ApplicationUser> userManager,
        ILogger logger,
        AdminSeedOptions options)
    {
        if (!options.Enabled)
        {
            logger.LogInformation("Administrator seed is disabled.");
            return;
        }

        if (string.IsNullOrWhiteSpace(options.Email) || string.IsNullOrWhiteSpace(options.Password))
        {
            logger.LogWarning("Administrator seed is enabled, but email/password are not configured.");
            return;
        }

        var existingAdmin = await userManager.FindByEmailAsync(options.Email);
        if (existingAdmin is null)
        {
            var admin = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = options.Email,
                Email = options.Email,
                FirstName = options.FirstName,
                LastName = options.LastName,
                EmployeeCode = options.EmployeeCode,
                Department = options.Department,
                IsActive = true,
                IsDeleted = false,
                EmailConfirmed = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "System"
            };

            var result = await userManager.CreateAsync(admin, options.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Administrator");
                logger.LogInformation("Default administrator account seeded successfully.");
            }
            else
            {
                logger.LogWarning("Failed to seed administrator: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}
