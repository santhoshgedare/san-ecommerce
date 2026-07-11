using FluentAssertions;
using SanEcommerceApp.Application.Common.Models;

namespace SanEcommerceApp.Tests.Services;

/// <summary>
/// Unit tests for the <see cref="Result{T}"/> and <see cref="Result"/> classes.
/// </summary>
public class ResultTests
{
    [Fact]
    public void Success_Generic_Should_Have_IsSuccess_True()
    {
        var result = Result<string>.Success("hello");

        result.IsSuccess.Should().BeTrue();
        result.IsFailure.Should().BeFalse();
        result.Data.Should().Be("hello");
        result.ErrorMessage.Should().BeNull();
    }

    [Fact]
    public void Failure_Generic_Should_Have_IsFailure_True()
    {
        var result = Result<string>.Failure("Something went wrong");

        result.IsSuccess.Should().BeFalse();
        result.IsFailure.Should().BeTrue();
        result.Data.Should().BeNull();
        result.ErrorMessage.Should().Be("Something went wrong");
    }

    [Fact]
    public void Failure_Generic_With_Errors_Should_Contain_Errors()
    {
        var errors = new[] { "Error 1", "Error 2" };
        var result = Result<string>.Failure("Multiple errors", errors);

        result.IsFailure.Should().BeTrue();
        result.Errors.Should().Contain("Error 1");
        result.Errors.Should().Contain("Error 2");
    }

    [Fact]
    public void Success_NonGeneric_Should_Have_IsSuccess_True()
    {
        var result = Result.Success();

        result.IsSuccess.Should().BeTrue();
        result.IsFailure.Should().BeFalse();
        result.ErrorMessage.Should().BeNull();
    }

    [Fact]
    public void Failure_NonGeneric_Should_Have_IsFailure_True()
    {
        var result = Result.Failure("Operation failed");

        result.IsSuccess.Should().BeFalse();
        result.IsFailure.Should().BeTrue();
        result.ErrorMessage.Should().Be("Operation failed");
    }

    [Fact]
    public void Result_Errors_Should_Default_To_Empty()
    {
        var result = Result<int>.Success(42);
        result.Errors.Should().BeEmpty();
    }
}
