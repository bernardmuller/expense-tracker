import type { StatusCode } from "hono/utils/http-status";

type ErrorOptions = {
  code: string;
  error: string;
  statusCode: StatusCode;
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
