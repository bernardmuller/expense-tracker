import { Context, Effect } from "effect";
import type {
  CreateUserCategoryParams,
  UserCategory,
} from "@/domain/entities/userCategory";
import type { MissingRequiredFieldsError } from "@/domain/entities/userCategory/userCategoryErrors";

export interface UserCategoryServiceShape {
  readonly createUserCategory: (
    params: CreateUserCategoryParams,
  ) => Effect.Effect<UserCategory, MissingRequiredFieldsError>;
}

export class UserCategoryService extends Context.Tag(
  "domain/use-cases/userCategoryService",
)<UserCategoryService, UserCategoryServiceShape>() {}
