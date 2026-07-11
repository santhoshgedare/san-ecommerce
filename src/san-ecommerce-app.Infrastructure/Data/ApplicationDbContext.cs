
using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Infrastructure.Data;

/// <summary>
/// The application database context, using ASP.NET Core Identity and EF Core.
/// Global query filters are applied for soft-delete support.
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    /// <summary>
    /// Initializes a new instance of <see cref="ApplicationDbContext"/>.
    /// </summary>
    /// <param name="options">The database context options.</param>
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    /// <inheritdoc/>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply all entity configurations from this assembly
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Global query filter: exclude soft-deleted ApplicationUsers
        builder.Entity<ApplicationUser>()
            .HasQueryFilter(u => !u.IsDeleted);

        // Global query filter: exclude soft-deleted ApplicationRoles
        builder.Entity<ApplicationRole>()
            .HasQueryFilter(r => !r.IsDeleted);
    }

    /// <inheritdoc/>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return base.SaveChangesAsync(cancellationToken);
    }
}
