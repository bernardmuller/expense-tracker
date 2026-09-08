import { createRouter } from "@/lib/http/createApi";
import { createNotificationsRoute } from "./http/createNotifications.route";
import { createNotificationsHandler } from "./http/createNotifications.handler";
import { sendNotificationsRoute } from "./http/sendNotifications.route";
import { sendNotificationsHandler } from "./http/sendNotifications.handler";

export const cronRouter = createRouter()
  .openapi(createNotificationsRoute, createNotificationsHandler)
  .openapi(sendNotificationsRoute, sendNotificationsHandler);
