using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SanEcommerceApp.Domain.Entities;

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

        await SeedRolesAsync(roleManager, logger);
        await SeedAdminUserAsync(userManager, logger);
    }

    private static async Task SeedRolesAsync(
        RoleManager<ApplicationRole> roleManager,
        ILogger logger)
    {
        string[] roles = ["Administrator", "Manager", "Employee"];

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var role = new ApplicationRole(roleName, $"Default {roleName} role");
                var result = await roleManager.CreateAsync(role);
                if (result.Succeeded)
                    logger.LogInformation("Seeded role: {RoleName}", roleName);
                else
                    logger.LogWarning("Failed to seed role {RoleName}: {Errors}", roleName,
                        string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }

    private static async Task SeedAdminUserAsync(
        UserManager<ApplicationUser> userManager,
        ILogger logger)
    {
        const string adminEmail = "admin@san-ecommerce.com";
        const string adminPassword = "Admin@123456";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin is null)
        {
            var admin = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "System",
                LastName = "Administrator",
                EmployeeCode = "EMP-ADMIN-001",
                Department = "IT",
                IsActive = true,
                IsDeleted = false,
                EmailConfirmed = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "System"
            };

            var result = await userManager.CreateAsync(admin, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Administrator");
                // Log only domain part to avoid exposing full email in logs
                var emailDomain = adminEmail.Contains('@') ? adminEmail[adminEmail.IndexOf('@')..] : "[redacted]";
                logger.LogInformation("Seeded administrator account with domain: {EmailDomain}", emailDomain);
            }
            else
            {
                logger.LogWarning("Failed to seed administrator: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}
