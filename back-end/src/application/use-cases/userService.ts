import type { CreateUserParams, User } from "@/domain/entities/user";
import type { UserServiceShape } from "@/domain/use-cases/userService";
import type { UserValidationError } from "@/domain/entities/user/userErrors";
import type {
  EntityCreateError,
  EntityUpdateError,
  EntityNotFoundError,
} from "@/domain/errors/repositoryErrors";
import * as UserEntity from "@/domain/entities/user";
import { UserRepository } from "@/domain/repositories/userRepository";
import { UserService } from "@/domain/use-cases/userService";
import { Effect, Layer, pipe } from "effect";

export const userServiceLive = Layer.effect(
  UserService,
  pipe(
    UserRepository,
    Effect.map((userRepository) => {
      const service: UserServiceShape = {
        createUser: (params: CreateUserParams) =>
          pipe(
            UserEntity.createUser(params),
            Effect.andThen(userRepository.create),
          ),
        getAllUsers: () => userRepository.read(),
        markUserAsOnboarded: (user: User) =>
          pipe(
            UserEntity.markUserAsOnboarded(user),
            Effect.andThen(userRepository.update),
            Effect.catchTag("UserAlreadyOnboardedError", (error) =>
              Effect.logError("User Already onboarded").pipe(
                Effect.flatMap(() => Effect.fail(error)),
              ),
            ),
          ),
        markUserAsVerified: (user: User) =>
          pipe(
            UserEntity.markUserAsVerified(user),
            Effect.andThen(userRepository.update),
            Effect.catchTag("UserAlreadyOnboardedError", (error) =>
              Effect.logError("User Already onboarded").pipe(
                Effect.flatMap(() => Effect.fail(error)),
              ),
            ),
          ),
        updateUser: (user: User, params: User) =>
          pipe(
            UserEntity.updateUser(user, params),
            Effect.andThen(userRepository.update),
          ),
        isUserFullySetup: (user: User) =>
          Effect.sync(() => UserEntity.isUserFullySetup(user)),
      };
      return service;
    }),
  ),
);
