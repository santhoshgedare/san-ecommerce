namespace SanEcommerceApp.Application.Security;

/// <summary>
/// Central application permission catalog and default role mappings.
/// </summary>
public static class AppPermissions
{
    public const string ClaimType = "permission";
    public const string PolicyPrefix = "Permission";

    public const string DashboardView = "dashboard.view";
    public const string UsersView = "users.view";
    public const string UsersCreate = "users.create";
    public const string UsersEdit = "users.edit";
    public const string UsersDelete = "users.delete";
    public const string UsersRestore = "users.restore";
    public const string UsersAssignRoles = "users.assign-roles";
    public const string UsersResetPassword = "users.reset-password";
    public const string RolesView = "roles.view";
    public const string RolesManage = "roles.manage";
    public const string PermissionsView = "permissions.view";
    public const string PermissionsManage = "permissions.manage";
    public const string ProfileView = "profile.view";
    public const string SettingsManage = "settings.manage";

    public static IReadOnlyCollection<string> All { get; } =
    [
        DashboardView,
        UsersView,
        UsersCreate,
        UsersEdit,
        UsersDelete,
        UsersRestore,
        UsersAssignRoles,
        UsersResetPassword,
        RolesView,
        RolesManage,
        PermissionsView,
        PermissionsManage,
        ProfileView,
        SettingsManage
    ];

    public static IReadOnlyDictionary<string, IReadOnlyCollection<string>> DefaultRolePermissions { get; } =
        new Dictionary<string, IReadOnlyCollection<string>>(StringComparer.OrdinalIgnoreCase)
        {
            ["Administrator"] = All,
            ["Manager"] =
            [
                DashboardView,
                UsersView,
                UsersCreate,
                UsersEdit,
                UsersAssignRoles,
                RolesView,
                PermissionsView,
                ProfileView,
                SettingsManage
            ],
            ["Employee"] =
            [
                DashboardView,
                ProfileView
            ]
        };

    public static string BuildPolicy(string permission)
        => $"{PolicyPrefix}:{permission}";
}
