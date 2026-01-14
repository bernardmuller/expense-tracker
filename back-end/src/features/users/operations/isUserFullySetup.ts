import { ok, type ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserDomain from "../actions";
import type { User } from "../types";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { getUserById } from "./getUserById";

export const isUserFullySetup = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  boolean,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    ok(UserDomain.isUserFullySetup(user)),
  );
