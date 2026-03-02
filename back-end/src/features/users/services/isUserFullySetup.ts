import { ok } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserDomain from "../actions";
import type { User } from "../types";
import { getUserById } from "./getUserById";
import { AppResult } from "@/lib/result";

export const isUserFullySetup = (
  userId: string,
  ctx: AppContext,
): AppResult<boolean> =>
  getUserById(userId, ctx).andThen((user: User) =>
    ok(UserDomain.isUserFullySetup(user)),
  );
