import { createError } from "@/lib/utils/createError";

export const InvalidCategoryLabelError = createError(
  "InvalidCategoryLabelError",
  (label: string) => `Invalid category label: ${label}`,
  {
    code: "INVALID_CATEGORY_LABEL",
    error: "Bad Request",
    statusCode: 400,
  },
);

export const InvalidCategoryKeyError = createError(
  "InvalidCategoryKeyError",
  (key: string) => `Invalid category key: ${key}`,
  {
    code: "INVALID_CATEGORY_KEY",
    error: "Bad Request",
    statusCode: 400,
  },
);

export type CategoryValidationError =
  | InstanceType<typeof InvalidCategoryLabelError>
  | InstanceType<typeof InvalidCategoryKeyError>;
