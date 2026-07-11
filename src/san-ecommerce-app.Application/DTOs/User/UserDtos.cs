namespace SanEcommerceApp.Application.DTOs.User;

/// <summary>DTO representing user details.</summary>
public class UserDto
{
    /// <summary>Gets or sets the user's identifier.</summary>
    public Guid Id { get; set; }

    /// <summary>Gets or sets the user's first name.</summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>Gets or sets the user's last name.</summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>Gets or sets the user's full name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Gets or sets the user's email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the user's phone number.</summary>
    public string? PhoneNumber { get; set; }

    /// <summary>Gets or sets the employee code.</summary>
    public string? EmployeeCode { get; set; }

    /// <summary>Gets or sets the department.</summary>
    public string? Department { get; set; }

    /// <summary>Gets or sets the profile image URL or path.</summary>
    public string? ProfileImage { get; set; }

    /// <summary>Gets or sets a value indicating whether the user is active.</summary>
    public bool IsActive { get; set; }

    /// <summary>Gets or sets the date and time the user was created.</summary>
    public DateTime CreatedOn { get; set; }

    /// <summary>Gets or sets the roles assigned to the user.</summary>
    public IEnumerable<string> Roles { get; set; } = [];
}

/// <summary>DTO for registering a new user.</summary>
public class RegisterUserDto
{
    /// <summary>Gets or sets the first name.</summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>Gets or sets the last name.</summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>Gets or sets the email address.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Gets or sets the password.</summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>Gets or sets the password confirmation.</summary>
    public string ConfirmPassword { get; set; } = string.Empty;

    /// <summary>Gets or sets the employee code.</summary>
    public string? EmployeeCode { get; set; }

    /// <summary>Gets or sets the department.</summary>
    public string? Department { get; set; }

    /// <summary>Gets or sets the phone number.</summary>
    public string? PhoneNumber { get; set; }

    /// <summary>Gets or sets the roles to assign on registration.</summary>
    public IEnumerable<string> Roles { get; set; } = [];
}

/// <summary>DTO for updating an existing user.</summary>
public class UpdateUserDto
{
    /// <summary>Gets or sets the first name.</summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>Gets or sets the last name.</summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>Gets or sets the employee code.</summary>
    public string? EmployeeCode { get; set; }

    /// <summary>Gets or sets the department.</summary>
    public string? Department { get; set; }

    /// <summary>Gets or sets the phone number.</summary>
    public string? PhoneNumber { get; set; }

    /// <summary>Gets or sets the profile image URL or path.</summary>
    public string? ProfileImage { get; set; }

    /// <summary>Gets or sets a value indicating whether the user is active.</summary>
    public bool IsActive { get; set; } = true;
}
