import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type {
  NotificationPreference,
  NotificationPreferenceWithEntity,
} from "../types";
import type { SearchQueries } from "@/lib/http/types";
import type { NotificationPreferenceFilters } from "../repositories";
import * as NotificationPreferenceRepo from "../repositories";

export const getNotificationPreferencesWithEntity = (
  userId: string,
  search: SearchQueries<
    NotificationPreference,
    { type: string; channel: string; enabled: boolean }
  >,
  ctx: AppContext,
): AppResult<NotificationPreferenceWithEntity[]> => {
  return NotificationPreferenceRepo.findAllWithEntity(
    { ...search, userId } as SearchQueries<
      NotificationPreference,
      NotificationPreferenceFilters
    >,
    ctx,
  );
};
