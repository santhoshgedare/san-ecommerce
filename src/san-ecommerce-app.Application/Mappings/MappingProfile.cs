using AutoMapper;
using SanEcommerceApp.Application.DTOs.Role;
using SanEcommerceApp.Application.DTOs.User;
using SanEcommerceApp.Domain.Entities;

namespace SanEcommerceApp.Application.Mappings;

/// <summary>
/// AutoMapper profile defining all entity-to-DTO and DTO-to-entity mappings.
/// </summary>
public class MappingProfile : Profile
{
    /// <summary>Initializes a new instance of the <see cref="MappingProfile"/> class.</summary>
    public MappingProfile()
    {
        // ApplicationUser -> UserDto (map only DTO properties from user)
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Roles, opt => opt.Ignore()); // Roles are populated separately

        // RegisterUserDto -> ApplicationUser (only map source DTO properties; entity has many extra fields)
        CreateMap<RegisterUserDto, ApplicationUser>(MemberList.Source)
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(_ => false))
            .ForSourceMember(src => src.Password, opt => opt.DoNotValidate())
            .ForSourceMember(src => src.ConfirmPassword, opt => opt.DoNotValidate())
            .ForSourceMember(src => src.Roles, opt => opt.DoNotValidate());

        // UpdateUserDto -> ApplicationUser (only map source DTO properties)
        CreateMap<UpdateUserDto, ApplicationUser>(MemberList.Source)
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Email, opt => opt.Ignore())
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));

        // ApplicationRole -> RoleDto
        CreateMap<ApplicationRole, RoleDto>();

        // CreateRoleDto -> ApplicationRole (only map source DTO properties; role entity has extra fields)
        CreateMap<CreateRoleDto, ApplicationRole>(MemberList.Source)
            .ForMember(dest => dest.NormalizedName, opt => opt.MapFrom(src => src.Name.ToUpperInvariant()))
            .ForSourceMember(src => src.Permissions, opt => opt.DoNotValidate());

        // UpdateRoleDto -> ApplicationRole
        CreateMap<UpdateRoleDto, ApplicationRole>(MemberList.Source)
            .ForMember(dest => dest.NormalizedName, opt => opt.MapFrom(src => src.Name.ToUpperInvariant()))
            .ForSourceMember(src => src.Permissions, opt => opt.DoNotValidate());
    }
}
