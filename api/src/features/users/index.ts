import { createRouter } from "@/lib/http/createApi";
import { getAllUsersRoute } from "./http/getAllUsers.route";
import { getAllUsersHandler } from "./http/getAllUsers.handler";
import { getUserByIdRoute } from "./http/getUserById.route";
import { getUserByIdHandler } from "./http/getUserById.handler";
import { createUserRoute } from "./http/createUser.route";
import { createUserHandler } from "./http/createUser.handler";
import { markUserAsOnboardedRoute } from "./http/markUserAsOnboarded.route";
import { markUserAsOnboardedHandler } from "./http/markUserAsOnboarded.handler";
import { onboardUserRoute } from "./http/onboardUser.route";
import { onboardUserHandler } from "./http/onboardUser.handler";
import { createBudgetRoute } from "./http/createBudget.route";
import { createBudgetHandler } from "./http/createBudget.handler";
import { markUserAsVerifiedRoute } from "./http/markUserAsVerified.route";
import { markUserAsVerifiedHandler } from "./http/markUserAsVerified.handler";
import { updateUserRoute } from "./http/updateUser.route";
import { updateUserHandler } from "./http/updateUser.handler";
import { isUserFullySetupRoute } from "./http/isUserFullySetup.route";
import { isUserFullySetupHandler } from "./http/isUserFullySetup.handler";
import { getUserPreferencesRoute } from "./http/getUserPreferences.route";
import { getUserPreferencesHandler } from "./http/getUserPreferences.handler";
import { updateUserPreferencesRoute } from "./http/updateUserPreferences.route";
import { updateUserPreferencesHandler } from "./http/updateUserPreferences.handler";
import { getUserCategoriesRoute } from "./http/getUserCategories.route";
import { getUserCategoriesHandler } from "./http/getUserCategories.handler";

export const userRouter = createRouter()
  .openapi(getAllUsersRoute, getAllUsersHandler)
  .openapi(getUserByIdRoute, getUserByIdHandler)
  .openapi(createUserRoute, createUserHandler)
  .openapi(markUserAsOnboardedRoute, markUserAsOnboardedHandler)
  .openapi(onboardUserRoute, onboardUserHandler)
  .openapi(createBudgetRoute, createBudgetHandler)
  .openapi(markUserAsVerifiedRoute, markUserAsVerifiedHandler)
  .openapi(updateUserRoute, updateUserHandler)
  .openapi(isUserFullySetupRoute, isUserFullySetupHandler)
  .openapi(getUserPreferencesRoute, getUserPreferencesHandler)
  .openapi(updateUserPreferencesRoute, updateUserPreferencesHandler)
  .openapi(getUserCategoriesRoute, getUserCategoriesHandler);
