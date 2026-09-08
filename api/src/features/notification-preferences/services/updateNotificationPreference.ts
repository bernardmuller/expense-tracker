import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { UpdateNotificationPreferenceParams, NotificationPreference } from "../types";
import * as NotificationPreferenceRepo from "../repositories";

export const updateNotificationPreference = (
  id: string,
  userId: string,
  params: UpdateNotificationPreferenceParams,
  ctx: AppContext,
): AppResult<NotificationPreference> => {
  return NotificationPreferenceRepo.update(id, userId, params, ctx);
};
