using FluentAssertions;
using FluentValidation.TestHelper;
using SanEcommerceApp.Application.DTOs.User;
using SanEcommerceApp.Application.Validators;

namespace SanEcommerceApp.Tests.Validators;

/// <summary>
/// Unit tests for <see cref="RegisterUserValidator"/>.
/// </summary>
public class RegisterUserValidatorTests
{
    private readonly RegisterUserValidator _validator = new();

    private static RegisterUserDto ValidRequest() => new()
    {
        FirstName = "John",
        LastName = "Doe",
        Email = "john.doe@example.com",
        Password = "Passw0rd@1",
        ConfirmPassword = "Passw0rd@1"
    };

    [Fact]
    public void Should_Pass_When_All_Fields_Valid()
    {
        var result = _validator.TestValidate(ValidRequest());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Should_Fail_When_FirstName_Is_Empty()
    {
        var request = ValidRequest();
        request.FirstName = "";
        _validator.TestValidate(request).ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void Should_Fail_When_Email_Is_Invalid()
    {
        var request = ValidRequest();
        request.Email = "not-an-email";
        _validator.TestValidate(request).ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Should_Fail_When_Password_Missing_Uppercase()
    {
        var request = ValidRequest();
        request.Password = "passw0rd@1";
        request.ConfirmPassword = "passw0rd@1";
        _validator.TestValidate(request).ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Should_Fail_When_Password_Missing_Digit()
    {
        var request = ValidRequest();
        request.Password = "Password@abc";
        request.ConfirmPassword = "Password@abc";
        _validator.TestValidate(request).ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Should_Fail_When_Passwords_Do_Not_Match()
    {
        var request = ValidRequest();
        request.ConfirmPassword = "Different@Password1";
        _validator.TestValidate(request).ShouldHaveValidationErrorFor(x => x.ConfirmPassword);
    }
}
