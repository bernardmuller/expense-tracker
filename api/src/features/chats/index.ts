import { createRouter } from "@/lib/http/createApi";
import { getChatsRoute } from "./http/getChats.route";
import { getChatsHandler } from "./http/getChats.handler";
import { getChatByIdRoute } from "./http/getChatById.route";
import { getChatByIdHandler } from "./http/getChatById.handler";
import { createChatRoute } from "./http/createChat.route";
import { createChatHandler } from "./http/createChat.handler";
import { updateChatRoute } from "./http/updateChat.route";
import { updateChatHandler } from "./http/updateChat.handler";
import { deleteChatRoute } from "./http/deleteChat.route";
import { deleteChatHandler } from "./http/deleteChat.handler";

export const chatRouter = createRouter()
  .openapi(getChatsRoute, getChatsHandler)
  .openapi(getChatByIdRoute, getChatByIdHandler)
  .openapi(createChatRoute, createChatHandler)
  .openapi(updateChatRoute, updateChatHandler)
  .openapi(deleteChatRoute, deleteChatHandler);
