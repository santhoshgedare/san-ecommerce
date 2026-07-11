using AutoMapper;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SanEcommerceApp.Application.Mappings;
using SanEcommerceApp.Application.Validators;
using SanEcommerceApp.Application.DTOs.Auth;
using SanEcommerceApp.Application.DTOs.User;

namespace SanEcommerceApp.Application.Extensions;

/// <summary>
/// Extension methods for registering Application layer services with the DI container.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds all Application layer services to the service collection.
    /// </summary>
    /// <param name="services">The service collection to add services to.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(cfg =>
        {
            cfg.AddMaps(typeof(MappingProfile).Assembly);
        });

        // FluentValidation
        services.AddScoped<IValidator<LoginRequestDto>, LoginValidator>();
        services.AddScoped<IValidator<ForgotPasswordRequestDto>, ForgotPasswordValidator>();
        services.AddScoped<IValidator<ResetPasswordRequestDto>, ResetPasswordValidator>();
        services.AddScoped<IValidator<ChangePasswordRequestDto>, ChangePasswordValidator>();
        services.AddScoped<IValidator<RegisterUserDto>, RegisterUserValidator>();
        services.AddScoped<IValidator<UpdateUserDto>, UpdateUserValidator>();

        return services;
    }
}
