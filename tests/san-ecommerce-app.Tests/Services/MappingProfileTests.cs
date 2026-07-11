using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using SanEcommerceApp.Application.DTOs.User;
using SanEcommerceApp.Application.Mappings;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Tests.Services;

/// <summary>
/// Unit tests for AutoMapper profiles.
/// </summary>
public class MappingProfileTests
{
    private readonly IMapper _mapper;

    public MappingProfileTests()
    {
        var config = new MapperConfiguration(
            cfg => cfg.AddMaps(typeof(MappingProfile).Assembly),
            NullLoggerFactory.Instance);
        _mapper = config.CreateMapper();
    }

    [Fact]
    public void MapperConfiguration_Should_Be_Valid()
    {
        var config = new MapperConfiguration(
            cfg => cfg.AddMaps(typeof(MappingProfile).Assembly),
            NullLoggerFactory.Instance);
        // Should not throw
        config.AssertConfigurationIsValid();
    }

    [Fact]
    public void ApplicationUser_To_UserDto_Should_Map_Correctly()
    {
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            FirstName = "Jane",
            LastName = "Smith",
            Email = "jane.smith@example.com",
            PhoneNumber = "+1234567890",
            EmployeeCode = "EMP-001",
            Department = "Engineering",
            IsActive = true,
            CreatedOn = DateTime.UtcNow
        };

        var dto = _mapper.Map<UserDto>(user);

        dto.Id.Should().Be(user.Id);
        dto.FirstName.Should().Be("Jane");
        dto.LastName.Should().Be("Smith");
        dto.FullName.Should().Be("Jane Smith");
        dto.Email.Should().Be("jane.smith@example.com");
        dto.EmployeeCode.Should().Be("EMP-001");
        dto.Department.Should().Be("Engineering");
        dto.IsActive.Should().BeTrue();
    }

    [Fact]
    public void RegisterUserDto_To_ApplicationUser_Should_Map_Correctly()
    {
        var dto = new RegisterUserDto
        {
            FirstName = "Bob",
            LastName = "Jones",
            Email = "bob@example.com",
            Password = "password",
            ConfirmPassword = "password"
        };

        var user = _mapper.Map<ApplicationUser>(dto);

        user.FirstName.Should().Be("Bob");
        user.LastName.Should().Be("Jones");
        user.Email.Should().Be("bob@example.com");
        user.UserName.Should().Be("bob@example.com");
        user.IsActive.Should().BeTrue();
        user.IsDeleted.Should().BeFalse();
    }
}
