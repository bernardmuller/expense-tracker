import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { chatSchema } from "../types";

const tags = ["Chats"];

export const deleteChatRoute = createRoute({
  path: "/chats/{id}",
  method: "delete",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ chat: chatSchema }),
      "Deleted chat",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Chat not found"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
