using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SanEcommerceApp.Application.Common.Models;
using SanEcommerceApp.Application.DTOs.User;
using SanEcommerceApp.Application.Services.Interfaces;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Infrastructure.Services;

/// <summary>
/// User management service using ASP.NET Core Identity.
/// </summary>
public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserService"/> class.
    /// </summary>
    public UserService(UserManager<ApplicationUser> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    /// <inheritdoc/>
    public async Task<Result<IEnumerable<UserDto>>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userManager.Users.ToListAsync(cancellationToken);
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var dto = _mapper.Map<UserDto>(user);
            dto.Roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(dto);
        }

        return Result<IEnumerable<UserDto>>.Success(userDtos);
    }

    /// <inheritdoc/>
    public async Task<Result<UserDto>> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return Result<UserDto>.Failure("User not found.");

        var dto = _mapper.Map<UserDto>(user);
        dto.Roles = await _userManager.GetRolesAsync(user);

        return Result<UserDto>.Success(dto);
    }

    /// <inheritdoc/>
    public async Task<Result<UserDto>> RegisterUserAsync(RegisterUserDto request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
            return Result<UserDto>.Failure("A user with this email already exists.");

        var user = _mapper.Map<ApplicationUser>(request);
        user.Id = Guid.NewGuid();
        user.CreatedOn = DateTime.UtcNow;
        user.CreatedBy = request.Email;

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            return Result<UserDto>.Failure("User creation failed.", createResult.Errors.Select(e => e.Description));

        // Assign roles
        if (request.Roles.Any())
        {
            var roleResult = await _userManager.AddToRolesAsync(user, request.Roles);
            if (!roleResult.Succeeded)
                return Result<UserDto>.Failure("User created but role assignment failed.", roleResult.Errors.Select(e => e.Description));
        }

        var dto = _mapper.Map<UserDto>(user);
        dto.Roles = await _userManager.GetRolesAsync(user);

        return Result<UserDto>.Success(dto);
    }

    /// <inheritdoc/>
    public async Task<Result<UserDto>> UpdateUserAsync(Guid userId, UpdateUserDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return Result<UserDto>.Failure("User not found.");

        _mapper.Map(request, user);
        user.ModifiedOn = DateTime.UtcNow;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return Result<UserDto>.Failure("User update failed.", updateResult.Errors.Select(e => e.Description));

        var dto = _mapper.Map<UserDto>(user);
        dto.Roles = await _userManager.GetRolesAsync(user);

        return Result<UserDto>.Success(dto);
    }

    /// <inheritdoc/>
    public async Task<Result> DeleteUserAsync(Guid userId, string deletedBy, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return Result.Failure("User not found.");

        // Soft delete
        user.IsDeleted = true;
        user.DeletedOn = DateTime.UtcNow;
        user.DeletedBy = deletedBy;
        user.IsActive = false;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return Result.Failure("User deletion failed.", updateResult.Errors.Select(e => e.Description));

        return Result.Success();
    }

    /// <inheritdoc/>
    public async Task<Result> AssignRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return Result.Failure("User not found.");

        var result = await _userManager.AddToRoleAsync(user, roleName);
        if (!result.Succeeded)
            return Result.Failure("Role assignment failed.", result.Errors.Select(e => e.Description));

        return Result.Success();
    }

    /// <inheritdoc/>
    public async Task<Result> RemoveRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return Result.Failure("User not found.");

        var result = await _userManager.RemoveFromRoleAsync(user, roleName);
        if (!result.Succeeded)
            return Result.Failure("Role removal failed.", result.Errors.Select(e => e.Description));

        return Result.Success();
    }

    /// <inheritdoc/>
    public async Task<Result<IEnumerable<string>>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return Result<IEnumerable<string>>.Failure("User not found.");

        var roles = await _userManager.GetRolesAsync(user);
        return Result<IEnumerable<string>>.Success(roles);
    }
}
