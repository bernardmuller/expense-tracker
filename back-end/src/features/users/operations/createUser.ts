import { errAsync, type ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import * as UserDomain from "../actions";
import type { CreateUserParams, User } from "../types";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";

export const createUser = (
  params: CreateUserParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityReadError>
> =>
  UserQueries.findByEmail(params.email, ctx)
    .andThen(() => errAsync(new UserEmailAlreadyInUseError(params.email)))
    .orElse((error) =>
      error instanceof EntityNotFoundError
        ? UserDomain.createUser(params).asyncAndThen((user) =>
            UserQueries.create(user, ctx),
          )
        : errAsync(error),
    );
