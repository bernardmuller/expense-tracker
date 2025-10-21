import type { ContentfulStatusCode } from "hono/utils/http-status";

type ErrorOptions = {
  code: string;
  error: string;
  statusCode: ContentfulStatusCode;
};

function getDefaultOptions<Tag extends string>(tag: Tag): ErrorOptions {
  const code = tag
    .replace(/([A-Z])/g, "_$1")
    .toUpperCase()
    .slice(1);
  if (tag.includes("NotFound")) {
    return {
      code,
      error: "Not Found",
      statusCode: 404,
    };
  }
  return {
    code,
    error: "Validation Error",
    statusCode: 422,
  };
}

/**
 * Creates a custom error class with a tag and message builder.
 * @example
 * const NotFoundError = createError(
 *   "NotFoundError",
 *   (id: string) => `Not found: ${id}`
 * );
 * const error = new NotFoundError("123", underlyingError);
 *
 * @example
 * const ValidationError = createError(
 *   "ValidationError",
 *   (msg: string) => msg,
 *   { code: "VALIDATION_ERROR", error: "Bad Request", statusCode: 400 }
 * );
 */
export function createError<Tag extends string, Param = string>(
  tag: Tag,
  messageBuilder: (param: Param) => string,
  options?: Partial<ErrorOptions>,
) {
  const defaultOptions = getDefaultOptions(tag);
  const finalOptions: ErrorOptions = {
    ...defaultOptions,
    ...options,
  };

  return class extends Error {
    readonly _tag = tag;
    readonly code = finalOptions.code;
    readonly error = finalOptions.error;
    readonly statusCode = finalOptions.statusCode;

    constructor(
      public readonly value?: Param,
      cause?: unknown,
    ) {
      super(messageBuilder(value!));
      this.name = tag;
      this.cause = cause;
    }
  };
}
