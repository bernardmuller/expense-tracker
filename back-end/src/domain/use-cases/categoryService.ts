import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/domain/entities/category";
import type {
  InvalidCategoryKeyError,
  InvalidCategoryLabelError,
  MissingRequiredFieldsError,
} from "@/domain/entities/category/categoryErrors";
import { Context, Effect } from "effect";

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
