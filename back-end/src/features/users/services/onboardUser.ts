import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories";
import * as UserDomain from "../actions";
import type { OnboardingParams, User } from "../types/index";
import { getUserById } from "./getUserById";
import { AppResult } from "@/lib/result";

export const onboardUser = (
  userId: string,
  params: OnboardingParams,
  ctx: AppContext,
): AppResult<User> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsOnboarded(user).asyncAndThen(() =>
      UserRepo.onboardUser(userId, params, ctx),
    ),
  );
