import { createRouter } from "@/lib/http/createApi";
import { getAllUsersRoute } from "./getAllUsers.route";
import { getAllUsersHandler } from "./getAllUsers.handler";
import { getUserByIdRoute } from "./getUserById.route";
import { getUserByIdHandler } from "./getUserById.handler";
import { createUserRoute } from "./createUser.route";
import { createUserHandler } from "./createUser.handler";
import { markUserAsOnboardedRoute } from "./markUserAsOnboarded.route";
import { markUserAsOnboardedHandler } from "./markUserAsOnboarded.handler";
import { onboardUserRoute } from "./onboardUser.route";
import { onboardUserHandler } from "./onboardUser.handler";
import { createBudgetRoute } from "./createBudget.route";
import { createBudgetHandler } from "./createBudget.handler";
import { markUserAsVerifiedRoute } from "./markUserAsVerified.route";
import { markUserAsVerifiedHandler } from "./markUserAsVerified.handler";
import { updateUserRoute } from "./updateUser.route";
import { updateUserHandler } from "./updateUser.handler";
import { isUserFullySetupRoute } from "./isUserFullySetup.route";
import { isUserFullySetupHandler } from "./isUserFullySetup.handler";
import { getUserPreferencesRoute } from "./getUserPreferences.route";
import { getUserPreferencesHandler } from "./getUserPreferences.handler";
import { updateUserPreferencesRoute } from "./updateUserPreferences.route";
import { updateUserPreferencesHandler } from "./updateUserPreferences.handler";
import { getUserCategoriesRoute } from "./getUserCategories.route";
import { getUserCategoriesHandler } from "./getUserCategories.handler";

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

// Barrel exports
export * from "./getAllUsers.route";
export * from "./getAllUsers.handler";
export * from "./getUserById.route";
export * from "./getUserById.handler";
export * from "./createUser.route";
export * from "./createUser.handler";
export * from "./onboardUser.route";
export * from "./onboardUser.handler";
export * from "./createBudget.route";
export * from "./createBudget.handler";
export * from "./markUserAsOnboarded.route";
export * from "./markUserAsOnboarded.handler";
export * from "./markUserAsVerified.route";
export * from "./markUserAsVerified.handler";
export * from "./updateUser.route";
export * from "./updateUser.handler";
export * from "./isUserFullySetup.route";
export * from "./isUserFullySetup.handler";
export * from "./getUserPreferences.route";
export * from "./getUserPreferences.handler";
export * from "./updateUserPreferences.route";
export * from "./updateUserPreferences.handler";
export * from "./getUserCategories.route";
export * from "./getUserCategories.handler";
