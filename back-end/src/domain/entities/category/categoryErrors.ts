import { createError } from "@/lib/utils/createError";

export const InvalidCategoryLabelError = createError(
  "InvalidCategoryLabelError",
  (label: string) => `Invalid category label: ${label}`,
);

export const InvalidCategoryKeyError = createError(
  "InvalidCategoryKeyError",
  (key: string) => `Invalid category key: ${key}`,
);

export type CategoryValidationError =
  | InstanceType<typeof InvalidCategoryLabelError>
  | InstanceType<typeof InvalidCategoryKeyError>;
