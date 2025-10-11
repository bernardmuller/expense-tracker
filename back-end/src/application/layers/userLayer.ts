import type { CreateUserParams, User } from "@/domain/entities/user";
import { UserService } from "@/domain/use-cases/userService";
import { Effect, Layer, pipe } from "effect";
import { userServiceLive } from "../use-cases/userService";
import { userRepositoryLive } from "@/infrastructure/repositories/userRepository";
import type {
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
  UserValidationError,
} from "@/domain/entities/user/userErrors";
import type {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/domain/errors/repositoryErrors";

export interface UserLayerShape {
  readonly createUser: (params: CreateUserParams) => Effect.Effect<User>;
  readonly getAllUsers: () => Effect.Effect<User[]>;
}

const userLayer = pipe(
  Effect.all([UserService]),
  Effect.map(([userService]) => ({
    createUser: (params: CreateUserParams) => userService.createUser(params),
    getAllUsers: () => userService.getAllUsers(),
  })),
);

export class UserLayer extends Effect.Tag("/application/use-cases/UserLayer")<
  UserLayer,
  UserLayerShape
>() {}

export const UserLayerLive = Layer.effect(UserLayer, userLayer).pipe(
  Layer.provide(userServiceLive),
  Layer.provide(userRepositoryLive),
);
