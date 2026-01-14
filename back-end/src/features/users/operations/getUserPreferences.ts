import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import type { UserPreferences } from "../types";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";

export const getUserPreferences = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  UserQueries.findPreferencesByUserId(userId, ctx).map((prefs) => ({
    budgetStartDate: prefs.budgetStartDate,
    frequency: prefs.frequency as
      | "weekly"
      | "bi-weekly"
      | "monthly"
      | "custom"
      | null,
    customDuration: prefs.customDuration,
  }));
