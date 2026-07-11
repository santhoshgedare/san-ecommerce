namespace SanEcommerceApp.Application.Common.Models;

/// <summary>
/// Represents the result of an operation, encapsulating success/failure state and data.
/// </summary>
/// <typeparam name="T">The type of the result data.</typeparam>
public class Result<T>
{
    /// <summary>Gets or sets a value indicating whether the operation succeeded.</summary>
    public bool IsSuccess { get; private set; }

    /// <summary>Gets or sets the result data (only valid when <see cref="IsSuccess"/> is true).</summary>
    public T? Data { get; private set; }

    /// <summary>Gets or sets the error message (only valid when <see cref="IsSuccess"/> is false).</summary>
    public string? ErrorMessage { get; private set; }

    /// <summary>Gets or sets additional error details or validation messages.</summary>
    public IEnumerable<string> Errors { get; private set; } = [];

    /// <summary>Gets a value indicating whether the operation failed.</summary>
    public bool IsFailure => !IsSuccess;

    private Result() { }

    /// <summary>Creates a successful result with the given data.</summary>
    public static Result<T> Success(T data) =>
        new() { IsSuccess = true, Data = data };

    /// <summary>Creates a failed result with an error message.</summary>
    public static Result<T> Failure(string errorMessage) =>
        new() { IsSuccess = false, ErrorMessage = errorMessage };

    /// <summary>Creates a failed result with an error message and additional errors.</summary>
    public static Result<T> Failure(string errorMessage, IEnumerable<string> errors) =>
        new() { IsSuccess = false, ErrorMessage = errorMessage, Errors = errors };
}

/// <summary>
/// Represents the result of an operation with no return value.
/// </summary>
public class Result
{
    /// <summary>Gets a value indicating whether the operation succeeded.</summary>
    public bool IsSuccess { get; private set; }

    /// <summary>Gets the error message (only valid when <see cref="IsSuccess"/> is false).</summary>
    public string? ErrorMessage { get; private set; }

    /// <summary>Gets additional error details or validation messages.</summary>
    public IEnumerable<string> Errors { get; private set; } = [];

    /// <summary>Gets a value indicating whether the operation failed.</summary>
    public bool IsFailure => !IsSuccess;

    private Result() { }

    /// <summary>Creates a successful result.</summary>
    public static Result Success() => new() { IsSuccess = true };

    /// <summary>Creates a failed result with an error message.</summary>
    public static Result Failure(string errorMessage) =>
        new() { IsSuccess = false, ErrorMessage = errorMessage };

    /// <summary>Creates a failed result with an error message and additional errors.</summary>
    public static Result Failure(string errorMessage, IEnumerable<string> errors) =>
        new() { IsSuccess = false, ErrorMessage = errorMessage, Errors = errors };
}
