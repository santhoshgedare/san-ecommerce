using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SanEcommerceApp.Domain.Entities;
using SanEcommerceApp.Domain.Interfaces;
using SanEcommerceApp.Infrastructure.Data;

namespace SanEcommerceApp.Infrastructure.Repositories;

/// <summary>
/// Generic repository implementation backed by EF Core.
/// Soft-delete is applied automatically via the <c>SoftDelete</c> method and global query filters.
/// </summary>
/// <typeparam name="T">The entity type, must inherit from <see cref="BaseEntity"/>.</typeparam>
public class Repository<T> : IRepository<T> where T : BaseEntity
{
    /// <summary>The database context.</summary>
    protected readonly ApplicationDbContext _context;

    /// <summary>The DbSet for the entity type.</summary>
    protected readonly DbSet<T> _dbSet;

    /// <summary>
    /// Initializes a new instance of the <see cref="Repository{T}"/> class.
    /// </summary>
    /// <param name="context">The database context.</param>
    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    /// <inheritdoc/>
    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _dbSet.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    /// <inheritdoc/>
    public async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _dbSet.ToListAsync(cancellationToken);

    /// <inheritdoc/>
    public async Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
        => await _dbSet.Where(predicate).ToListAsync(cancellationToken);

    /// <inheritdoc/>
    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    /// <inheritdoc/>
    public void Update(T entity)
        => _dbSet.Update(entity);

    /// <inheritdoc/>
    public void Delete(T entity)
        => _dbSet.Remove(entity);

    /// <inheritdoc/>
    public void SoftDelete(T entity)
    {
        entity.IsDeleted = true;
        entity.DeletedOn = DateTime.UtcNow;
        _dbSet.Update(entity);
    }

    /// <inheritdoc/>
    public async Task<bool> ExistsAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
        => await _dbSet.AnyAsync(predicate, cancellationToken);
}
