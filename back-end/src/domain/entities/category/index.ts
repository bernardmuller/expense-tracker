import { Effect } from "effect";
import {
  MissingRequiredFieldsError,
  CategoryAlreadySoftDeletedError,
  InvalidCategoryLabelError,
  InvalidCategoryKeyError,
} from "./categoryErrors";
import { generateUuid } from "@/lib/utils/generateUuid";
import { getCurrentISOString } from "@/lib/utils/time";

export type Category = {
  readonly id: string;
  key: string;
  label: string;
  icon: string;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateCategoryParams = Omit<
  Category,
  "id" | "deletedAt" | "updatedAt"
>;

export const createCategory = (
  params: CreateCategoryParams,
): Effect.Effect<Category, MissingRequiredFieldsError> =>
  Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!params.key) missingFields.push("key");
    if (!params.label) missingFields.push("label");
    if (!params.icon) missingFields.push("icon");

    if (missingFields.length > 0) {
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );
    }

    const uuid = yield* Effect.sync(() => generateUuid());

    return {
      ...params,
      id: uuid,
      deletedAt: undefined,
      updatedAt: undefined,
    };
  });

export type UpdateCategoryParams = Partial<
  Pick<Category, "key" | "label" | "icon">
>;

export const updateCategory = (
  category: Category,
  params: UpdateCategoryParams,
): Effect.Effect<
  Category,
  InvalidCategoryLabelError | InvalidCategoryKeyError
> =>
  Effect.gen(function* () {
    if (params.label !== undefined && (!params.label || params.label.trim() === "")) {
      return yield* Effect.fail(
        new InvalidCategoryLabelError({
          label: params.label,
        }),
      );
    }

    if (params.key !== undefined && (!params.key || params.key.trim() === "")) {
      return yield* Effect.fail(
        new InvalidCategoryKeyError({
          key: params.key,
        }),
      );
    }

    const now = yield* getCurrentISOString;

    return {
      ...category,
      ...(params.key !== undefined && { key: params.key }),
      ...(params.label !== undefined && { label: params.label }),
      ...(params.icon !== undefined && { icon: params.icon }),
      updatedAt: now,
    };
  });

export const softDeleteCategory = (
  category: Category,
): Effect.Effect<Category, CategoryAlreadySoftDeletedError> =>
  Effect.gen(function* () {
    if (category.deletedAt) {
      return yield* Effect.fail(
        new CategoryAlreadySoftDeletedError({
          categoryId: category.id,
        }),
      );
    }

    const now = yield* getCurrentISOString;

    return {
      ...category,
      deletedAt: now,
    };
  });

export const isCategorySoftDeleted = (category: Category): boolean =>
  !!category.deletedAt;
