import type { CreateUserParams } from "@/domain/entities/user";
import { UserService } from "@/domain/use-cases/userService";
import { Effect, Layer, pipe } from "effect";
import { BudgetServiceLive } from "../use-cases/budgetService";
import { userServiceLive } from "../use-cases/userService";

const userLayer = pipe(
  Effect.all([UserService]),
  Effect.map(([userService]) => ({
    createUser: (params: CreateUserParams) => userService.createUser(params),
    getAllUsers: () => userService.getAllUsers(),
  })),
);

export type UserLayerShape = Effect.Effect.Success<typeof userLayer>;

export class UserLayer extends Effect.Tag("/application/use-cases/UserLayer")<
  UserLayer,
  UserLayerShape
>() {}

export const UserLayerLive = Layer.effect(UserLayer, userLayer).pipe(
  Layer.provide(userServiceLive),
);
