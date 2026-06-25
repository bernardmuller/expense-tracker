import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { NotificationPreference } from "../types";
import * as NotificationPreferenceRepo from "../repositories";

export const getNotificationPreferenceById = (
  id: string,
  userId: string,
  ctx: AppContext,
): AppResult<NotificationPreference> => {
  return NotificationPreferenceRepo.findById(id, userId, ctx);
};
