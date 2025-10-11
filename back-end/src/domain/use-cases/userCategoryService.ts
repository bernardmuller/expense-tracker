import type {
  CreateUserCategoryParams,
  UserCategory,
} from "@/domain/entities/userCategory";
import type { UserCategoryError } from "@/domain/entities/userCategory/userCategoryErrors";
import type { Result } from "neverthrow";

export interface UserCategoryService {
  readonly createUserCategory: (
    params: CreateUserCategoryParams,
  ) => Result<UserCategory, UserCategoryError>;
}
