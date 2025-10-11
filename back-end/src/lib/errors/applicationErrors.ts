export class UnexpectedError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "UnexpectedError";
  }
}

export type TUnexpectedError = InstanceType<typeof UnexpectedError>;
