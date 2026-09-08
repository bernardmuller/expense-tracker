import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories";
import type { UpdateUserPreferencesParams, UserPreferences } from "../types";
import { AppResult } from "@/lib/result";

export const updateUserPreferences = (
  userId: string,
  params: UpdateUserPreferencesParams,
  ctx: AppContext,
): AppResult<UserPreferences> =>
  UserRepo.updatePreferences(
    userId,
    {
      budgetStartDate: params.budgetStartDate
        ? params.budgetStartDate
        : undefined,
      frequency: params.frequency,
      customDuration: params.customDuration,
    },
    ctx,
  ).map((prefs) => ({
    budgetStartDate: prefs.budgetStartDate,
    frequency: prefs.frequency as
      | "weekly"
      | "bi-weekly"
      | "monthly"
      | "custom"
      | null,
    customDuration: prefs.customDuration,
  }));
