import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories";
import * as UserDomain from "../actions";
import type { User } from "../types";
import { getUserById } from "./getUserById";
import { AppResult } from "@/lib/result";

export const updateUser = (
  userId: string,
  updates: Partial<User>,
  ctx: AppContext,
): AppResult<User> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.updateUser(user, updates).asyncAndThen((user) =>
      UserRepo.update(user, ctx),
    ),
  );
