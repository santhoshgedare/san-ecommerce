using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace SanEcommerceApp.API.Middleware;

/// <summary>
/// Global exception handling middleware that converts unhandled exceptions to RFC 7807 ProblemDetails responses.
/// </summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    /// <summary>
    /// Initializes a new instance of the <see cref="ExceptionMiddleware"/> class.
    /// </summary>
    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    /// <summary>
    /// Invokes the middleware, catching and formatting any unhandled exceptions.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Sanitize path and method to prevent log injection
            var sanitizedMethod = context.Request.Method.Replace(Environment.NewLine, "").Replace("\r", "").Replace("\n", "");
            var sanitizedPath = context.Request.Path.ToString().Replace(Environment.NewLine, "").Replace("\r", "").Replace("\n", "");
            _logger.LogError(ex, "An unhandled exception occurred while processing {Method} {Path}",
                sanitizedMethod,
                sanitizedPath);

            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var (statusCode, title) = exception switch
        {
            ArgumentNullException => (HttpStatusCode.BadRequest, "Bad Request"),
            ArgumentException => (HttpStatusCode.BadRequest, "Bad Request"),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Unauthorized"),
            KeyNotFoundException => (HttpStatusCode.NotFound, "Not Found"),
            InvalidOperationException => (HttpStatusCode.Conflict, "Conflict"),
            _ => (HttpStatusCode.InternalServerError, "Internal Server Error")
        };

        context.Response.StatusCode = (int)statusCode;

        var problem = new ProblemDetails
        {
            Status = (int)statusCode,
            Title = title,
            Detail = _env.IsDevelopment() ? exception.ToString() : exception.Message,
            Instance = context.Request.Path,
        };

        problem.Extensions["traceId"] = context.TraceIdentifier;
        problem.Extensions["timestamp"] = DateTimeOffset.UtcNow;

        var json = JsonSerializer.Serialize(problem, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
