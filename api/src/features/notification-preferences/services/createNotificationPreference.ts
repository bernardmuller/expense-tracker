import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { CreateNotificationPreferenceParams, NotificationPreference } from "../types";
import * as NotificationPreferenceRepo from "../repositories";

export const createNotificationPreference = (
  userId: string,
  params: CreateNotificationPreferenceParams,
  ctx: AppContext,
): AppResult<NotificationPreference> => {
  return NotificationPreferenceRepo.create(userId, params, ctx);
};
