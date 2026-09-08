import { errAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories/index";
import * as UserDomain from "../actions";
import type { CreateUserParams, User } from "../types/index";
import { AppResult } from "@/lib/result";
import { AuthenticationError, DatabaseError } from "@/lib/errors/domain";

export const createUser = (
  params: CreateUserParams,
  ctx: AppContext,
): AppResult<User> =>
  UserRepo.findByEmail(params.email, ctx)
    .andThen(() => errAsync(new AuthenticationError(params.email)))
    .orElse((error) =>
      error instanceof DatabaseError
        ? UserDomain.createUser(params).asyncAndThen((user) =>
            UserRepo.create(user, ctx),
          )
        : errAsync(error),
    );
