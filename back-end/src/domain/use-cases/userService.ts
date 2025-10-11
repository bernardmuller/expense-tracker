import type { CreateUserParams, User } from "@/domain/entities/user";
import type {
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
  UserValidationError,
} from "@/domain/entities/user/userErrors";
import { Context, Effect } from "effect";
import type {
  EntityCreateError,
  EntityReadError,
  EntityUpdateError,
} from "../errors/repositoryErrors";

export interface UserServiceShape {
  readonly createUser: (
    params: CreateUserParams,
  ) => Effect.Effect<User, EntityCreateError>;
  readonly getAllUsers: () => Effect.Effect<User[], EntityReadError>;
  readonly markUserAsOnboarded: (
    user: User,
  ) => Effect.Effect<User, UserAlreadyOnboardedError, EntityUpdateError>;
  readonly markUserAsVerified: (
    user: User,
  ) => Effect.Effect<User, UserAlreadyVerifiedError, EntityUpdateError>;
  readonly updateUser: (
    user: User,
    params: User,
  ) => Effect.Effect<User, EntityUpdateError>;
  readonly isUserFullySetup: (user: User) => Effect.Effect<boolean>;
}

export class UserService extends Context.Tag("domain/use-cases/userService")<
  UserService,
  UserServiceShape
>() {}
