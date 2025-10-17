type Metadata = {
  entityId: string;
};

/**
 * Creates a custom error class with a tag and message builder.
 * @example
 * const NotFoundError = createError(
 *   "NotFoundError",
 *   (id: string) => `Not found: ${id}`
 * );
 * const error = new NotFoundError("123", underlyingError);
 */
export function createError<Tag extends string, Param = string>(
  tag: Tag,
  messageBuilder: (param: Param) => string,
) {
  return class extends Error {
    readonly _tag = tag;

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
