import type { Context } from "hono";

export function mapErrorToResponse(error: unknown, c: Context) {
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
      // I know, I know... Nothing else works
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
