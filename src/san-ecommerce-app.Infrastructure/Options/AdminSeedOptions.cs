namespace SanEcommerceApp.Infrastructure.Options;

/// <summary>
/// Configures the optional administrator bootstrap user.
/// </summary>
public sealed class AdminSeedOptions
{
    public const string SectionName = "Seed:Admin";

    public bool Enabled { get; set; }

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string FirstName { get; set; } = "System";

    public string LastName { get; set; } = "Administrator";

    public string EmployeeCode { get; set; } = "EMP-ADMIN-001";

    public string Department { get; set; } = "IT";
}
