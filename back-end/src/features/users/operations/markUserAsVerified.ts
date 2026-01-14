import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import * as UserDomain from "../actions";
import type { User, UserAlreadyVerifiedError } from "../types";
import {
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { getUserById } from "./getUserById";

export const markUserAsVerified = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof UserAlreadyVerifiedError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsVerified(user).asyncAndThen((user) =>
      UserQueries.update(user, ctx),
    ),
  );
