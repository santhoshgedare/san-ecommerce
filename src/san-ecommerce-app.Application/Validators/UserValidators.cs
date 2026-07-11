using FluentValidation;
using SanEcommerceApp.Application.DTOs.User;

namespace SanEcommerceApp.Application.Validators;

/// <summary>Validator for <see cref="RegisterUserDto"/>.</summary>
public class RegisterUserValidator : AbstractValidator<RegisterUserDto>
{
    /// <summary>Initializes a new instance of the <see cref="RegisterUserValidator"/> class.</summary>
    public RegisterUserValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(256).WithMessage("Email must not exceed 256 characters.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Passwords do not match.");

        RuleFor(x => x.EmployeeCode)
            .MaximumLength(50).WithMessage("Employee code must not exceed 50 characters.")
            .When(x => !string.IsNullOrEmpty(x.EmployeeCode));

        RuleFor(x => x.Department)
            .MaximumLength(100).WithMessage("Department must not exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.Department));
    }
}

/// <summary>Validator for <see cref="UpdateUserDto"/>.</summary>
public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
{
    /// <summary>Initializes a new instance of the <see cref="UpdateUserValidator"/> class.</summary>
    public UpdateUserValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");

        RuleFor(x => x.EmployeeCode)
            .MaximumLength(50).WithMessage("Employee code must not exceed 50 characters.")
            .When(x => !string.IsNullOrEmpty(x.EmployeeCode));

        RuleFor(x => x.Department)
            .MaximumLength(100).WithMessage("Department must not exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.Department));
    }
}
