using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Infrastructure.Data.Configurations;

/// <summary>
/// EF Core Fluent API configuration for <see cref="ApplicationRole"/>.
/// </summary>
public class ApplicationRoleConfiguration : IEntityTypeConfiguration<ApplicationRole>
{
    /// <inheritdoc/>
    public void Configure(EntityTypeBuilder<ApplicationRole> builder)
    {
        builder.Property(r => r.Description)
            .HasMaxLength(500);
    }
}
