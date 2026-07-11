namespace SanEcommerceApp.Domain.Entities;

/// <summary>
/// Base entity containing audit fields and soft-delete support for all domain entities.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>Gets or sets the unique identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the date and time the entity was created.</summary>
    public DateTime CreatedOn { get; set; }

    /// <summary>Gets or sets the user who created the entity.</summary>
    public string CreatedBy { get; set; } = string.Empty;

    /// <summary>Gets or sets the date and time the entity was last modified.</summary>
    public DateTime? ModifiedOn { get; set; }

    /// <summary>Gets or sets the user who last modified the entity.</summary>
    public string? ModifiedBy { get; set; }

    /// <summary>Gets or sets a value indicating whether the entity has been soft-deleted.</summary>
    public bool IsDeleted { get; set; }

    /// <summary>Gets or sets the date and time the entity was deleted.</summary>
    public DateTime? DeletedOn { get; set; }

    /// <summary>Gets or sets the user who deleted the entity.</summary>
    public string? DeletedBy { get; set; }

    /// <summary>Gets or sets the row version for optimistic concurrency control.</summary>
    public byte[] RowVersion { get; set; } = [];
}
