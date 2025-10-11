import type { CreateUserParams, User } from "@/domain/entities/user";
import type { UserValidationError } from "@/domain/entities/user/userErrors";
import type {
  EntityCreateError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/repositoryErrors";
import type { Result } from "neverthrow";

export interface UserService {
  readonly createUser: (
    params: CreateUserParams,
  ) => Result<User, InstanceType<typeof EntityCreateError>>;
  readonly getAllUsers: () => Result<User[], InstanceType<typeof EntityReadError>>;
  readonly markUserAsOnboarded: (
    user: User,
  ) => Result<User, UserValidationError | InstanceType<typeof EntityUpdateError>>;
  readonly markUserAsVerified: (
    user: User,
  ) => Result<User, UserValidationError | InstanceType<typeof EntityUpdateError>>;
  readonly updateUser: (
    user: User,
    params: User,
  ) => Result<User, InstanceType<typeof EntityUpdateError>>;
  readonly isUserFullySetup: (user: User) => Result<boolean, never>;
}
