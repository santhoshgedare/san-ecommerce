using SanEcommerceApp.Application.Common.Models;
using SanEcommerceApp.Application.DTOs.User;

namespace SanEcommerceApp.Application.Services.Interfaces;

/// <summary>
/// Service interface for user management operations.
/// </summary>
public interface IUserService
{
    /// <summary>Retrieves all users.</summary>
    Task<Result<IEnumerable<UserDto>>> GetAllUsersAsync(CancellationToken cancellationToken = default);

    /// <summary>Retrieves a user by identifier.</summary>
    Task<Result<UserDto>> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>Registers a new user.</summary>
    Task<Result<UserDto>> RegisterUserAsync(RegisterUserDto request, CancellationToken cancellationToken = default);

    /// <summary>Updates an existing user.</summary>
    Task<Result<UserDto>> UpdateUserAsync(Guid userId, UpdateUserDto request, CancellationToken cancellationToken = default);

    /// <summary>Soft-deletes a user.</summary>
    Task<Result> DeleteUserAsync(Guid userId, string deletedBy, CancellationToken cancellationToken = default);

    /// <summary>Assigns a role to a user.</summary>
    Task<Result> AssignRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default);

    /// <summary>Removes a role from a user.</summary>
    Task<Result> RemoveRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default);

    /// <summary>Gets the roles assigned to a user.</summary>
    Task<Result<IEnumerable<string>>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default);
}
