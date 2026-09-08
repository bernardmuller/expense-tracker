import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories";
import { AppResult } from "@/lib/result";

export const getUserCategories = (
  userId: string,
  ctx: AppContext,
): AppResult<Array<{ id: string; key: string; label: string; icon: string }>> =>
  UserRepo.getUserCategories(userId, ctx);
