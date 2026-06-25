import { createRouter } from "@/lib/http/createApi";
import { getNotificationPreferencesRoute } from "./http/getNotificationPreferences.route";
import { getNotificationPreferencesHandler } from "./http/getNotificationPreferences.handler";
import { getNotificationPreferencesWithEntityRoute } from "./http/getNotificationPreferencesWithEntity.route";
import { getNotificationPreferencesWithEntityHandler } from "./http/getNotificationPreferencesWithEntity.handler";
import { getNotificationPreferenceByIdRoute } from "./http/getNotificationPreferenceById.route";
import { getNotificationPreferenceByIdHandler } from "./http/getNotificationPreferenceById.handler";
import { createNotificationPreferenceRoute } from "./http/createNotificationPreference.route";
import { createNotificationPreferenceHandler } from "./http/createNotificationPreference.handler";
import { updateNotificationPreferenceRoute } from "./http/updateNotificationPreference.route";
import { updateNotificationPreferenceHandler } from "./http/updateNotificationPreference.handler";
import { deleteNotificationPreferenceRoute } from "./http/deleteNotificationPreference.route";
import { deleteNotificationPreferenceHandler } from "./http/deleteNotificationPreference.handler";

export const notificationPreferencesRouter = createRouter()
  .openapi(getNotificationPreferencesRoute, getNotificationPreferencesHandler)
  .openapi(
    getNotificationPreferencesWithEntityRoute,
    getNotificationPreferencesWithEntityHandler,
  )
  .openapi(getNotificationPreferenceByIdRoute, getNotificationPreferenceByIdHandler)
  .openapi(createNotificationPreferenceRoute, createNotificationPreferenceHandler)
  .openapi(updateNotificationPreferenceRoute, updateNotificationPreferenceHandler)
  .openapi(deleteNotificationPreferenceRoute, deleteNotificationPreferenceHandler);
