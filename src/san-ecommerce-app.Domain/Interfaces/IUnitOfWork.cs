namespace SanEcommerceApp.Domain.Interfaces;

/// <summary>
/// Unit of Work interface coordinating multiple repositories within a single transaction.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>Commits all changes made within this unit of work to the database.</summary>
    Task<int> CommitAsync(CancellationToken cancellationToken = default);
}
