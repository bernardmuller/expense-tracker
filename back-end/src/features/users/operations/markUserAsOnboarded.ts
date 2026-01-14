import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import * as UserDomain from "../actions";
import type { User, UserAlreadyOnboardedError } from "../types";
import {
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { getUserById } from "./getUserById";

export const markUserAsOnboarded = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsOnboarded(user).asyncAndThen((user) =>
      UserQueries.update(user, ctx),
    ),
  );
