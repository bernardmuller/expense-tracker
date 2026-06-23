import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { chatSchema, updateChatSchema } from "../types";

const tags = ["Chats"];

export const updateChatRoute = createRoute({
  path: "/chats/{id}",
  method: "patch",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
    body: jsonContentRequired(updateChatSchema, "Fields to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ chat: chatSchema }),
      "Updated chat",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Chat not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorResponseSchema,
      "Validation error",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
