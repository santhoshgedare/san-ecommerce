using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Infrastructure.Data.Configurations;

/// <summary>
/// EF Core Fluent API configuration for <see cref="ApplicationUser"/>.
/// </summary>
public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    /// <inheritdoc/>
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.EmployeeCode)
            .HasMaxLength(50);

        builder.Property(u => u.Department)
            .HasMaxLength(100);

        builder.Property(u => u.ProfileImage)
            .HasMaxLength(500);

        builder.Property(u => u.CreatedBy)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(u => u.ModifiedBy)
            .HasMaxLength(256);

        builder.Property(u => u.DeletedBy)
            .HasMaxLength(256);

        builder.Property(u => u.RowVersion)
            .IsRowVersion()
            .IsConcurrencyToken();

        // Indexes for performance
        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.HasIndex(u => u.UserName)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.HasIndex(u => u.EmployeeCode)
            .IsUnique()
            .HasFilter("[EmployeeCode] IS NOT NULL AND [IsDeleted] = 0");
    }
}
