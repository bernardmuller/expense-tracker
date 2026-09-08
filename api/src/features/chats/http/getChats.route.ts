import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { chatSchema, chatsQueryParamsSchema } from "../types";

const tags = ["Chats"];

export const getChatsRoute = createRoute({
  path: "/chats",
  method: "get",
  tags,
  request: {
    query: chatsQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ chats: z.array(chatSchema), count: z.number() }),
      "List of chats",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      "Invalid query parameters",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
