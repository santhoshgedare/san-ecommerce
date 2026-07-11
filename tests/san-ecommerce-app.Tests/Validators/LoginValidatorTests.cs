using FluentAssertions;
using FluentValidation.TestHelper;
using SanEcommerceApp.Application.DTOs.Auth;
using SanEcommerceApp.Application.Validators;

namespace SanEcommerceApp.Tests.Validators;

/// <summary>
/// Unit tests for <see cref="LoginValidator"/>.
/// </summary>
public class LoginValidatorTests
{
    private readonly LoginValidator _validator = new();

    [Fact]
    public void Should_Pass_When_Valid_Credentials()
    {
        var request = new LoginRequestDto { Email = "test@example.com", Password = "password123" };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("missing@")]
    public void Should_Fail_When_Email_Is_Invalid(string email)
    {
        var request = new LoginRequestDto { Email = email, Password = "password123" };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Should_Fail_When_Password_Is_Empty()
    {
        var request = new LoginRequestDto { Email = "test@example.com", Password = "" };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Should_Fail_When_Password_Too_Short()
    {
        var request = new LoginRequestDto { Email = "test@example.com", Password = "abc" };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }
}
