import { AppError } from "./base";

export class DatabaseError extends AppError {
  readonly code = "DATABASE_ERROR";
  readonly statusCode = 500;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(`Database operation failed: ${message}`, metadata);
  }
}

export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND";
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(entity: string, metadata?: Record<string, unknown>) {
    super(`${entity} not found`, metadata);
  }
}

export class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

export class EncryptionError extends AppError {
  readonly code = "ENCRYPTION_ERROR";
  readonly statusCode = 500;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(`Encryption operation failed: ${message}`, metadata);
  }
}

export class AuthenticationError extends AppError {
  readonly code = "AUTHENTICATION_ERROR";
  readonly statusCode = 401;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

export class AuthorizationError extends AppError {
  readonly code = "AUTHORIZATION_ERROR";
  readonly statusCode = 403;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

export class EmailError extends AppError {
  readonly code = "EMAIL_ERROR";
  readonly statusCode = 500;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(`Email operation failed: ${message}`, metadata);
  }
}

export type DomainError =
  | DatabaseError
  | NotFoundError
  | ValidationError
  | EncryptionError
  | AuthenticationError
  | AuthorizationError
  | EmailError;
