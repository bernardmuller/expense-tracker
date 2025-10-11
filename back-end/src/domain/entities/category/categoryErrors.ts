export class InvalidCategoryLabelError extends Error {
  readonly _tag = "InvalidCategoryLabelError";
  constructor(public label: string) {
    super(`Invalid category label: ${label}`);
    this.name = "InvalidCategoryLabelError";
  }
}

export class InvalidCategoryKeyError extends Error {
  readonly _tag = "InvalidCategoryKeyError";
  constructor(public key: string) {
    super(`Invalid category key: ${key}`);
    this.name = "InvalidCategoryKeyError";
  }
}

export type CategoryValidationError =
  | InvalidCategoryLabelError
  | InvalidCategoryKeyError;
