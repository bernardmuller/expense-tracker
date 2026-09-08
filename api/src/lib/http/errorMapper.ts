import type { Context } from "hono";
import { AppError } from "@/lib/errors/base";

export function mapErrorToResponse(error: unknown, c: Context) {
  if (error instanceof AppError) {
    console.error({
      error: error.name,
      message: error.message,
      code: error.code,
      metadata: error.metadata,
      stack: error.stack,
    });

    return c.json(
      {
        error: error.name,
        message: error.message,
        code: error.code,
        ...(error.metadata && { details: error.metadata }),
      },
      error.statusCode as any,
    );
  }

  if (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    "code" in error &&
    "message" in error
  ) {
    const typedError = error as {
      statusCode: number;
      code: string;
      message: string;
      error: string;
    };

    console.log({
      ...typedError,
    });

    return c.json(
      {
        error: typedError.error || "Error",
        message: typedError.message,
        code: typedError.code,
      },
      typedError.statusCode as any,
    );
  }

  console.error("Unhandled error:", error);
  return c.json(
    {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
      code: "INTERNAL_SERVER_ERROR",
    },
    500,
  );
}
