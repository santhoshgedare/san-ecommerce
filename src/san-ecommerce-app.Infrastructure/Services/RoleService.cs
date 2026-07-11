using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SanEcommerceApp.Application.Common.Models;
using SanEcommerceApp.Application.DTOs.Role;
using SanEcommerceApp.Application.Services.Interfaces;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Infrastructure.Services;

/// <summary>
/// Role management service using ASP.NET Core Identity.
/// </summary>
public class RoleService : IRoleService
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="RoleService"/> class.
    /// </summary>
    public RoleService(RoleManager<ApplicationRole> roleManager, IMapper mapper)
    {
        _roleManager = roleManager;
        _mapper = mapper;
    }

    /// <inheritdoc/>
    public async Task<Result<IEnumerable<RoleDto>>> GetAllRolesAsync(CancellationToken cancellationToken = default)
    {
        var roles = await _roleManager.Roles
            .Where(r => !r.IsDeleted)
            .ToListAsync(cancellationToken);

        var dtos = _mapper.Map<IEnumerable<RoleDto>>(roles);
        return Result<IEnumerable<RoleDto>>.Success(dtos);
    }

    /// <inheritdoc/>
    public async Task<Result<RoleDto>> GetRoleByIdAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role is null || role.IsDeleted)
            return Result<RoleDto>.Failure("Role not found.");

        return Result<RoleDto>.Success(_mapper.Map<RoleDto>(role));
    }

    /// <inheritdoc/>
    public async Task<Result<RoleDto>> CreateRoleAsync(CreateRoleDto request, CancellationToken cancellationToken = default)
    {
        var existingRole = await _roleManager.FindByNameAsync(request.Name);
        if (existingRole is not null)
            return Result<RoleDto>.Failure($"Role '{request.Name}' already exists.");

        var role = _mapper.Map<ApplicationRole>(request);
        role.Id = Guid.NewGuid();

        var result = await _roleManager.CreateAsync(role);
        if (!result.Succeeded)
            return Result<RoleDto>.Failure("Role creation failed.", result.Errors.Select(e => e.Description));

        return Result<RoleDto>.Success(_mapper.Map<RoleDto>(role));
    }

    /// <inheritdoc/>
    public async Task<Result> DeleteRoleAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role is null || role.IsDeleted)
            return Result.Failure("Role not found.");

        // Soft delete
        role.IsDeleted = true;
        var result = await _roleManager.UpdateAsync(role);
        if (!result.Succeeded)
            return Result.Failure("Role deletion failed.", result.Errors.Select(e => e.Description));

        return Result.Success();
    }
}
