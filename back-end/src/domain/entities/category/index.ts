import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";
import {
  InvalidCategoryKeyError,
  InvalidCategoryLabelError,
} from "./categoryErrors";

export type Category = {
  readonly id: string;
  key: string;
  label: string;
  icon: string;
};

export type CreateCategoryParams = Omit<Category, "id">;

export const createCategory = (params: CreateCategoryParams) => {
  return ok({
    ...params,
    id: generateUuid(),
  });
};

export type UpdateCategoryParams = Partial<
  Pick<Category, "key" | "label" | "icon">
>;

export const updateCategory = (
  category: Category,
  params: UpdateCategoryParams,
) => {
  if (
    params.label !== undefined &&
    (!params.label || params.label.trim() === "")
  ) {
    return err(new InvalidCategoryLabelError(params.label));
  }

  if (params.key !== undefined && (!params.key || params.key.trim() === "")) {
    return err(new InvalidCategoryKeyError(params.key));
  }

  return ok({
    ...category,
    ...(params.key !== undefined && { key: params.key }),
    ...(params.label !== undefined && { label: params.label }),
    ...(params.icon !== undefined && { icon: params.icon }),
  });
};

export const isCategorySoftDeleted = (category: Category): boolean => false;
