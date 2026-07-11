using System.Linq.Expressions;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Domain.Interfaces;

/// <summary>
/// Generic repository interface providing standard CRUD and query operations.
/// </summary>
/// <typeparam name="T">The entity type, must inherit from <see cref="BaseEntity"/>.</typeparam>
public interface IRepository<T> where T : BaseEntity
{
    /// <summary>Gets an entity by its identifier.</summary>
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Gets all non-deleted entities.</summary>
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>Finds entities matching the given predicate.</summary>
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

    /// <summary>Adds a new entity.</summary>
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>Updates an existing entity.</summary>
    void Update(T entity);

    /// <summary>Physically deletes an entity (use with caution).</summary>
    void Delete(T entity);

    /// <summary>Soft-deletes an entity by setting <c>IsDeleted = true</c>.</summary>
    void SoftDelete(T entity);

    /// <summary>Checks whether any entity matching the predicate exists.</summary>
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
}
