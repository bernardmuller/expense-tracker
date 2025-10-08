import { Context, Effect } from "effect";
import type {
  CreateCategoryParams,
  Category,
  UpdateCategoryParams,
} from "@/domain/entities/category";
import type {
  InvalidCategoryLabelError,
  InvalidCategoryKeyError,
  MissingRequiredFieldsError,
} from "@/domain/entities/category/categoryErrors";

export interface CategoryServiceShape {
  readonly createCategory: (
    params: CreateCategoryParams,
  ) => Effect.Effect<Category, MissingRequiredFieldsError>;
  readonly updateCategory: (
    category: Category,
    params: UpdateCategoryParams,
  ) => Effect.Effect<
    Category,
    InvalidCategoryLabelError | InvalidCategoryKeyError
  >;
}

export class CategoryService extends Context.Tag(
  "domain/use-cases/categoryService",
)<CategoryService, CategoryServiceShape>() {}
