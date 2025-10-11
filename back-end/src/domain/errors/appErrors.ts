import { Data } from "effect";

/**
 * Base error class for all application errors
 * All errors in the application should extend from one of the category-specific base errors
 */
export class AppError extends Data.TaggedError("AppError")<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Base class for repository/data layer errors
 * These errors occur during database operations or data persistence
 */
export class RepositoryError extends Data.TaggedError("RepositoryError")<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Base class for domain validation errors
 * These errors occur when business rules are violated
 */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  message: string;
  details?: Record<string, unknown>;
}> {}

/**
 * Base class for infrastructure errors
 * These errors occur in external services, network calls, etc.
 */
export class InfrastructureError extends Data.TaggedError(
  "InfrastructureError",
)<{
  message: string;
  cause?: unknown;
}> {}
