import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories";
import * as UserDomain from "../actions";
import type { User } from "../types/index";
import { getUserById } from "./getUserById";
import { AppResult } from "@/lib/result";

export const markUserAsVerified = (
  userId: string,
  ctx: AppContext,
): AppResult<User> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsVerified(user).asyncAndThen((user) =>
      UserRepo.update(user, ctx),
    ),
  );
