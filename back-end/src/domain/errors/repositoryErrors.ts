import { Data } from "effect";
import { RepositoryError } from "./appErrors";

/**
 * Error thrown when an entity is not found in the repository
 */
export class EntityNotFoundError extends Data.TaggedError(
  "EntityNotFoundError",
)<{
  entityType: string;
  id: string;
  message?: string;
}> {
  get _tag() {
    return "RepositoryError" as const;
  }
}

/**
 * Error thrown when creating an entity fails
 */
export class EntityCreateError extends Data.TaggedError("EntityCreateError")<{
  entityType: string;
  message: string;
  cause?: unknown;
}> {
  get _tag() {
    return "RepositoryError" as const;
  }
}

/**
 * Error thrown when updating an entity fails
 */
export class EntityUpdateError extends Data.TaggedError("EntityUpdateError")<{
  entityType: string;
  id: string;
  message: string;
  cause?: unknown;
}> {
  get _tag() {
    return "RepositoryError" as const;
  }
}

/**
 * Error thrown when deleting an entity fails
 */
export class EntityDeleteError extends Data.TaggedError("EntityDeleteError")<{
  entityType: string;
  id: string;
  message: string;
  cause?: unknown;
}> {
  get _tag() {
    return "RepositoryError" as const;
  }
}

/**
 * Error thrown when reading/querying entities fails
 */
export class EntityReadError extends Data.TaggedError("EntityReadError")<{
  entityType: string;
  message: string;
  cause?: unknown;
}> {
  get _tag() {
    return "RepositoryError" as const;
  }
}

/**
 * Union type of all repository errors
 */
export type RepositoryErrorType =
  | EntityNotFoundError
  | EntityCreateError
  | EntityUpdateError
  | EntityDeleteError
  | EntityReadError;
