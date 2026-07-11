using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanEcommerceApp.API.Authorization;
using SanEcommerceApp.Application.Security;
using SanEcommerceApp.Application.DTOs.User;
using SanEcommerceApp.Application.Services.Interfaces;

namespace SanEcommerceApp.API.Controllers.v1;

/// <summary>
/// Manages user accounts (CRUD, role assignment).
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="UsersController"/> class.
    /// </summary>
    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>Gets all users.</summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>A list of users.</returns>
    [HttpGet]
    [HasPermission(AppPermissions.UsersView)]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _userService.GetAllUsersAsync(cancellationToken);
        return result.IsSuccess ? Ok(result.Data) : BadRequest(result.ErrorMessage);
    }

    /// <summary>Gets a user by identifier.</summary>
    /// <param name="id">The user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpGet("{id:guid}")]
    [HasPermission(AppPermissions.UsersView)]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _userService.GetUserByIdAsync(id, cancellationToken);
        if (result.IsFailure)
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Not Found",
                Detail = result.ErrorMessage
            });

        return Ok(result.Data);
    }

    /// <summary>Registers a new user.</summary>
    /// <param name="request">The user registration data.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserDto request,
        CancellationToken cancellationToken)
    {
        var result = await _userService.RegisterUserAsync(request, cancellationToken);
        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Registration Failed",
                Detail = result.ErrorMessage,
                Extensions = { ["errors"] = result.Errors }
            });

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    /// <summary>Updates an existing user.</summary>
    /// <param name="id">The user identifier.</param>
    /// <param name="request">The updated user data.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPut("{id:guid}")]
    [HasPermission(AppPermissions.UsersEdit)]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateUserDto request,
        CancellationToken cancellationToken)
    {
        var result = await _userService.UpdateUserAsync(id, request, cancellationToken);
        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Update Failed",
                Detail = result.ErrorMessage
            });

        return Ok(result.Data);
    }

    /// <summary>Soft-deletes a user.</summary>
    /// <param name="id">The user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpDelete("{id:guid}")]
    [HasPermission(AppPermissions.UsersDelete)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deletedBy = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "Unknown";
        var result = await _userService.DeleteUserAsync(id, deletedBy, cancellationToken);

        if (result.IsFailure)
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Not Found",
                Detail = result.ErrorMessage
            });

        return NoContent();
    }

    /// <summary>Gets roles assigned to a user.</summary>
    /// <param name="id">The user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpGet("{id:guid}/roles")]
    [HasPermission(AppPermissions.UsersView)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetRoles(Guid id, CancellationToken cancellationToken)
    {
        var result = await _userService.GetUserRolesAsync(id, cancellationToken);
        if (result.IsFailure)
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Not Found",
                Detail = result.ErrorMessage
            });

        return Ok(result.Data);
    }

    /// <summary>Assigns a role to a user.</summary>
    /// <param name="id">The user identifier.</param>
    /// <param name="roleName">The name of the role to assign.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpPost("{id:guid}/roles/{roleName}")]
    [HasPermission(AppPermissions.UsersAssignRoles)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignRole(
        Guid id,
        string roleName,
        CancellationToken cancellationToken)
    {
        var result = await _userService.AssignRoleAsync(id, roleName, cancellationToken);
        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Role Assignment Failed",
                Detail = result.ErrorMessage
            });

        return Ok(new { message = $"Role '{roleName}' assigned successfully." });
    }

    /// <summary>Removes a role from a user.</summary>
    /// <param name="id">The user identifier.</param>
    /// <param name="roleName">The name of the role to remove.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpDelete("{id:guid}/roles/{roleName}")]
    [HasPermission(AppPermissions.UsersAssignRoles)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveRole(
        Guid id,
        string roleName,
        CancellationToken cancellationToken)
    {
        var result = await _userService.RemoveRoleAsync(id, roleName, cancellationToken);
        if (result.IsFailure)
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Role Removal Failed",
                Detail = result.ErrorMessage
            });

        return NoContent();
    }
}
