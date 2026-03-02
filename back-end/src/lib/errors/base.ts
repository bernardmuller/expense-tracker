import type { StatusCode } from "hono/utils/http-status";

export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: StatusCode;
  abstract readonly isOperational: boolean;

  constructor(
    message: string,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
