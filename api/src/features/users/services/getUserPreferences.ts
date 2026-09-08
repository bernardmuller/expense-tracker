import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories";
import type { UserPreferences } from "../types";
import { AppResult } from "@/lib/result";

export const getUserPreferences = (
  userId: string,
  ctx: AppContext,
): AppResult<UserPreferences> =>
  UserRepo.findPreferencesByUserId(userId, ctx).map((prefs) => ({
    budgetStartDate: prefs.budgetStartDate,
    frequency: prefs.frequency as
      | "weekly"
      | "bi-weekly"
      | "monthly"
      | "custom"
      | null,
    customDuration: prefs.customDuration,
  }));
