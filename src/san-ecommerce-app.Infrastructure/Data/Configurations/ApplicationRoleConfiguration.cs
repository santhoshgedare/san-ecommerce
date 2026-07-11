using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using SanEcommerceApp.Domain.Entities;
using System.Text.Json;

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

        var permissionsComparer = new ValueComparer<ICollection<string>>(
            (left, right) => ReferenceEquals(left, right) || (left != null && right != null && left.SequenceEqual(right)),
            permissions => permissions == null
                ? 0
                : permissions.Aggregate(0, (current, permission) => HashCode.Combine(current, StringComparer.Ordinal.GetHashCode(permission))),
            permissions => permissions == null ? new List<string>() : permissions.ToList());

        builder.Property(r => r.Permissions)
            .HasConversion(
                permissions => JsonSerializer.Serialize(permissions, (JsonSerializerOptions?)null),
                value => string.IsNullOrWhiteSpace(value)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(value, (JsonSerializerOptions?)null) ?? new List<string>())
            .Metadata.SetValueComparer(permissionsComparer);
    }
}
