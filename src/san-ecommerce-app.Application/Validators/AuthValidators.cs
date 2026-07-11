using FluentValidation;
using SanEcommerceApp.Application.DTOs.Auth;

namespace SanEcommerceApp.Application.Validators;

/// <summary>Validator for <see cref="LoginRequestDto"/>.</summary>
public class LoginValidator : AbstractValidator<LoginRequestDto>
{
    /// <summary>Initializes a new instance of the <see cref="LoginValidator"/> class.</summary>
    public LoginValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.");
    }
}

/// <summary>Validator for <see cref="ForgotPasswordRequestDto"/>.</summary>
public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordRequestDto>
{
    /// <summary>Initializes a new instance of the <see cref="ForgotPasswordValidator"/> class.</summary>
    public ForgotPasswordValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.");
    }
}

/// <summary>Validator for <see cref="ResetPasswordRequestDto"/>.</summary>
public class ResetPasswordValidator : AbstractValidator<ResetPasswordRequestDto>
{
    /// <summary>Initializes a new instance of the <see cref="ResetPasswordValidator"/> class.</summary>
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.");

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Reset token is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

        RuleFor(x => x.ConfirmNewPassword)
            .Equal(x => x.NewPassword).WithMessage("Passwords do not match.");
    }
}

/// <summary>Validator for <see cref="ChangePasswordRequestDto"/>.</summary>
public class ChangePasswordValidator : AbstractValidator<ChangePasswordRequestDto>
{
    /// <summary>Initializes a new instance of the <see cref="ChangePasswordValidator"/> class.</summary>
    public ChangePasswordValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.")
            .NotEqual(x => x.CurrentPassword).WithMessage("New password must differ from the current password.");

        RuleFor(x => x.ConfirmNewPassword)
            .Equal(x => x.NewPassword).WithMessage("Passwords do not match.");
    }
}
