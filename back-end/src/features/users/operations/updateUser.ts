import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import * as UserDomain from "../actions";
import type { User } from "../types";
import {
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { getUserById } from "./getUserById";

export const updateUser = (
  userId: string,
  updates: Partial<User>,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.updateUser(user, updates).asyncAndThen((user) =>
      UserQueries.update(user, ctx),
    ),
  );
