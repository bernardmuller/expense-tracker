import { createError } from "@/lib/utils/createError";

export const CategoryNotFoundError = createError(
  "CategoryNotFoundError",
  (categoryId: string) => `Category ${categoryId} not found`,
  {
    code: "CATEGORY_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);
