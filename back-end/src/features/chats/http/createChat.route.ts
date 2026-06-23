import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { chatSchema, createChatSchema } from "../types";

const tags = ["Chats"];

export const createChatRoute = createRoute({
  path: "/chats",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createChatSchema, "Chat to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({ chat: chatSchema }),
      "Created chat",
    ),
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
