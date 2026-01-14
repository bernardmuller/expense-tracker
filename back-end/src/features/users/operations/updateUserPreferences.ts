import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import type { UpdateUserPreferencesParams, UserPreferences } from "../types";
import {
  EntityNotFoundError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";

export const updateUserPreferences = (
  userId: string,
  params: UpdateUserPreferencesParams,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityUpdateError>
> =>
  UserQueries.updatePreferences(
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
