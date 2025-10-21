import type { CreateUserParams, User } from "@/domain/entities/user";
import type { UserValidationError } from "@/domain/entities/user/userErrors";
import type {
  EntityCreateError,
  EntityReadError,
  RepositoryErrorType,
} from "@/lib/errors/repositoryErrors";
import type { ResultAsync } from "neverthrow";

export interface UserService {
  readonly createUser: (
    params: CreateUserParams,
  ) => ResultAsync<User, InstanceType<typeof EntityCreateError>>;
  readonly getAllUsers: () => ResultAsync<
    User[],
    InstanceType<typeof EntityReadError>
  >;
  readonly markUserAsOnboarded: (
    userId: string,
  ) => ResultAsync<User, UserValidationError | RepositoryErrorType>;
  readonly markUserAsVerified: (
    userId: string,
  ) => ResultAsync<User, UserValidationError | RepositoryErrorType>;
  readonly updateUser: (
    params: User,
  ) => ResultAsync<User, UserValidationError | RepositoryErrorType>;
  readonly isUserFullySetup: (
    userId: string,
  ) => ResultAsync<boolean, UserValidationError | RepositoryErrorType>;
}
