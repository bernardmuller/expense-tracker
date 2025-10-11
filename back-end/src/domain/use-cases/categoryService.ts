import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/domain/entities/category";
import type { CategoryValidationError } from "@/domain/entities/category/categoryErrors";
import type { Result } from "neverthrow";

export interface CategoryService {
  readonly createCategory: (
    params: CreateCategoryParams,
  ) => Result<Category, CategoryValidationError>;
  readonly updateCategory: (
    category: Category,
    params: UpdateCategoryParams,
  ) => Result<Category, CategoryValidationError>;
}
