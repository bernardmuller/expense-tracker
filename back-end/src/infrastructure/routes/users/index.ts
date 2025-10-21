import { createRouter } from "@/infrastructure/http/createApi";
import * as handlers from "@/infrastructure/handlers/users";
import * as routes from "./users.routes";

const router = createRouter()
  .openapi(routes.createUser, handlers.createUserHandler)
  .openapi(routes.getAllUsers, handlers.getAllUsersHandler);

export default router;
