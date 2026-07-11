using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanEcommerceApp.API.Authorization;
using SanEcommerceApp.Application.DTOs.Role;
using SanEcommerceApp.Application.Security;
using SanEcommerceApp.Application.Services.Interfaces;

namespace SanEcommerceApp.API.Controllers.v1;

/// <summary>
/// Manages application roles.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly ILogger<RolesController> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="RolesController"/> class.
    /// </summary>
    public RolesController(IRoleService roleService, ILogger<RolesController> logger)
    {
        _roleService = roleService;
        _logger = logger;
    }

    /// <summary>Gets all roles.</summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpGet]
    [HasPermission(AppPermissions.RolesView)]
    [ProducesResponseType(typeof(IEnumerable<RoleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _roleService.GetAllRolesAsync(cancellationToken);
        return Ok(result.Data);
    }

    /// <summary>Gets a role by identifier.</summary>
    /// <param name="id">The role identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpGet("{id:guid}")]
    [HasPermission(AppPermissions.RolesView)]
    [ProducesResponseType(typeof(RoleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _roleService.GetRoleByIdAsync(id, cancellationToken);
        if (result.IsFailure)
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Not Found",
                Detail = result.ErrorMessage
            });

        return Ok(result.Data);
    }

    /// <summary>Creates a new role.</summary>
    /// <param name="request">The role creation data.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPost]
    [HasPermission(AppPermissions.RolesManage)]
    [ProducesResponseType(typeof(RoleDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateRoleDto request,
        CancellationToken cancellationToken)
    {
        var result = await _roleService.CreateRoleAsync(request, cancellationToken);
        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Role Creation Failed",
                Detail = result.ErrorMessage
            });

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    /// <summary>Updates an existing role.</summary>
    /// <param name="id">The role identifier.</param>
    /// <param name="request">The role update data.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPut("{id:guid}")]
    [HasPermission(AppPermissions.RolesManage)]
    [ProducesResponseType(typeof(RoleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateRoleDto request,
        CancellationToken cancellationToken)
    {
        var result = await _roleService.UpdateRoleAsync(id, request, cancellationToken);
        if (result.IsFailure)
        {
            return result.ErrorMessage == "Role not found."
                ? NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Not Found",
                    Detail = result.ErrorMessage
                })
                : BadRequest(new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Role Update Failed",
                    Detail = result.ErrorMessage,
                    Extensions = { ["errors"] = result.Errors }
                });
        }

        return Ok(result.Data);
    }

    /// <summary>Soft-deletes a role.</summary>
    /// <param name="id">The role identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpDelete("{id:guid}")]
    [HasPermission(AppPermissions.RolesManage)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _roleService.DeleteRoleAsync(id, cancellationToken);
        if (result.IsFailure)
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Not Found",
                Detail = result.ErrorMessage
            });

        return NoContent();
    }
}
