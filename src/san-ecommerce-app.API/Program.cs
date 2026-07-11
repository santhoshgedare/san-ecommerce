using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SanEcommerceApp.API.Extensions;
using SanEcommerceApp.API.Middleware;
using SanEcommerceApp.Application.Extensions;
using SanEcommerceApp.Infrastructure.Data;
using SanEcommerceApp.Infrastructure.Extensions;

// ─── Serilog bootstrap logger ─────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // ─── Serilog ──────────────────────────────────────────────────────────────
    builder.Host.UseSerilog((context, services, configuration) =>
    {
        configuration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .WriteTo.File(
                path: "logs/san-ecommerce-app-.log",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 30,
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}");
    });

    // ─── Infrastructure & Application services ────────────────────────────────
    builder.Services.AddApplicationServices();
    builder.Services.AddInfrastructureServices(builder.Configuration);

    // ─── API services ─────────────────────────────────────────────────────────
    builder.Services.AddControllers();
    builder.Services.AddSwaggerWithVersioning();

    // Health Checks
    builder.Services.AddHealthChecks()
        .AddDbContextCheck<ApplicationDbContext>("database");

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", policy =>
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader());
    });

    // Authorization policies
    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("AdministratorOnly", policy =>
            policy.RequireRole("Administrator"));
        options.AddPolicy("ManagerOrAbove", policy =>
            policy.RequireRole("Administrator", "Manager"));
        options.AddPolicy("EmployeeOrAbove", policy =>
            policy.RequireRole("Administrator", "Manager", "Employee"));
    });

    // ─── Build the application ────────────────────────────────────────────────
    var app = builder.Build();

    // ─── Database migration & seeding ─────────────────────────────────────────
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        try
        {
            await dbContext.Database.MigrateAsync();
            await DatabaseSeeder.SeedAsync(app.Services);
            Log.Information("Database migration and seeding completed successfully.");
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "Database migration or seeding failed. The application will continue without migrations.");
        }
    }

    // ─── Middleware pipeline ───────────────────────────────────────────────────
    app.UseMiddleware<ExceptionMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwaggerWithVersioning();
    }

    app.UseHttpsRedirection();
    app.UseSerilogRequestLogging();
    app.UseCors("AllowAll");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.MapHealthChecks("/health", new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            var response = new
            {
                status = report.Status.ToString(),
                checks = report.Entries.Select(e => new
                {
                    name = e.Key,
                    status = e.Value.Status.ToString(),
                    description = e.Value.Description,
                    duration = e.Value.Duration
                }),
                totalDuration = report.TotalDuration
            };
            await context.Response.WriteAsJsonAsync(response);
        }
    });

    Log.Information("san-ecommerce-app API starting up...");
    await app.RunAsync();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");
}
finally
{
    await Log.CloseAndFlushAsync();
}
