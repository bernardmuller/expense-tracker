import { Context, Effect } from "effect";
import type { CreateUserParams, User } from "@/domain/entities/user";
import type {
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
  UserValidationError,
} from "@/domain/entities/user/userErrors";

export interface UserServiceShape {
  readonly createUser: (
    params: CreateUserParams,
  ) => Effect.Effect<User, UserValidationError>;
  readonly markUserAsOnboarded: (
    user: User,
  ) => Effect.Effect<User, UserAlreadyOnboardedError>;
  readonly markUserAsVerified: (
    user: User,
  ) => Effect.Effect<User, UserAlreadyVerifiedError>;
  readonly updateUser: (user: User) => Effect.Effect<User, never>;
  readonly isUserFullySetup: (user: User) => Effect.Effect<boolean, never>;
}

export class UserService extends Context.Tag("domain/use-cases/userService")<
  UserService,
  UserServiceShape
>() {}
