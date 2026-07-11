using SanEcommerceApp.Application.Common.Models;
using SanEcommerceApp.Application.DTOs.Role;

namespace SanEcommerceApp.Application.Services.Interfaces;

/// <summary>
/// Service interface for role management operations.
/// </summary>
public interface IRoleService
{
    /// <summary>Retrieves all roles.</summary>
    Task<Result<IEnumerable<RoleDto>>> GetAllRolesAsync(CancellationToken cancellationToken = default);

    /// <summary>Retrieves a role by identifier.</summary>
    Task<Result<RoleDto>> GetRoleByIdAsync(Guid roleId, CancellationToken cancellationToken = default);

    /// <summary>Creates a new role.</summary>
    Task<Result<RoleDto>> CreateRoleAsync(CreateRoleDto request, CancellationToken cancellationToken = default);

    /// <summary>Updates an existing role.</summary>
    Task<Result<RoleDto>> UpdateRoleAsync(Guid roleId, UpdateRoleDto request, CancellationToken cancellationToken = default);

    /// <summary>Deletes a role by identifier.</summary>
    Task<Result> DeleteRoleAsync(Guid roleId, CancellationToken cancellationToken = default);
}
