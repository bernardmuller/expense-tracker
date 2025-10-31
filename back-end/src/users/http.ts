import { createRouter } from "@/http/createApi";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { Context } from "hono";
import { createContext } from "@/db/context";
import * as UserOperations from "./operations";
import { createUserSchema, userSchema } from "./types";
import type { CreateUserParams } from "./types";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { mapErrorToResponse } from "@/http/errorMapper";

const tags = ["Users"];

// --------------------------------
// Route Definitions (OpenAPI)
// --------------------------------

const getAllUsersRoute = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(userSchema),
      "Returns a list of users",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const getUserByIdRoute = createRoute({
  path: "/users/{id}",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchema, "Return a user"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "User not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const createUserRoute = createRoute({
  path: "/users",
  method: "post",
  tags,
  request: {
    body: jsonContent(createUserSchema, "User creation data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      userSchema,
      "User created successfully",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorResponseSchema,
      "Validation error - email already in use",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const markUserAsOnboardedRoute = createRoute({
  path: "/users/{id}/onboard",
  method: "patch",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSchema,
      "User marked as onboarded successfully",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      "User already onboarded",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const markUserAsVerifiedRoute = createRoute({
  path: "/users/{id}/verify",
  method: "patch",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSchema,
      "User marked as verified successfully",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      "User already verified",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const updateUserRoute = createRoute({
  path: "/users/{id}",
  method: "patch",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
    body: jsonContent(userSchema.partial(), "User update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchema, "User updated successfully"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "User not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const isUserFullySetupRoute = createRoute({
  path: "/users/{id}/setup-status",
  method: "get",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ isFullySetup: z.boolean() }),
      "User setup status",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "User not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

// --------------------------------
// Handlers
// --------------------------------

const getAllUsersHandler = async (c: Context) => {
  const ctx = createContext();
  const result = await UserOperations.getAllUsers(ctx);

  return result.match(
    (users) => c.json(users, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const getUserByIdHandler = async (c: Context) => {
  const id = c.req.param("id");
  const ctx = createContext();
  const result = await UserOperations.getUserById(id, ctx);

  return result.match(
    (users) => c.json(users, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const createUserHandler = async (c: Context) => {
  const body = await c.req.json();
  const ctx = createContext();
  const result = await UserOperations.createUser(body, ctx);

  return result.match(
    (user) => c.json(user, 201),
    (error) => mapErrorToResponse(error, c),
  );
};

const markUserAsOnboardedHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const ctx = createContext();
  const result = await UserOperations.markUserAsOnboarded(userId, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const markUserAsVerifiedHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const ctx = createContext();
  const result = await UserOperations.markUserAsVerified(userId, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const updateUserHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const body = await c.req.json();
  const ctx = createContext();
  const result = await UserOperations.updateUser(userId, body, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const isUserFullySetupHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const ctx = createContext();
  const result = await UserOperations.isUserFullySetup(userId, ctx);

  return result.match(
    (isSetup) => c.json({ isFullySetup: isSetup }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

// --------------------------------
// Router
// --------------------------------

export const userRouter = createRouter()
  .openapi(getAllUsersRoute, getAllUsersHandler)
  .openapi(getUserByIdRoute, getUserByIdHandler)
  .openapi(createUserRoute, createUserHandler)
  .openapi(markUserAsOnboardedRoute, markUserAsOnboardedHandler)
  .openapi(markUserAsVerifiedRoute, markUserAsVerifiedHandler)
  .openapi(updateUserRoute, updateUserHandler)
  .openapi(isUserFullySetupRoute, isUserFullySetupHandler);
