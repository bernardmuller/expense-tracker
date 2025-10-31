import { createContext } from "@/db/context";
import { createRouter } from "@/http/createApi";
import { mapErrorToResponse } from "@/http/errorMapper";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { userSchema } from "@/users/types";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import { Ok } from "neverthrow";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { login, register } from "./operations";
import {
  loginResponseSchema,
  registerUserAndAccountSchema,
  type RegisterUserAndAccountParams,
} from "./types";

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const tags = ["Auth"];

// --------------------------------
// Route Definitions
// --------------------------------

const registerRoute = createRoute({
  path: "/register",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      registerUserAndAccountSchema,
      "Register a new user",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      userSchema,
      "User registered successfully",
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

const loginRoute = createRoute({
  path: "/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(loginSchema, "Register a new user"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      loginResponseSchema,
      "Logs a user in",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      "Validation error - email and/or password incorrect",
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

const registerHandler = async (c: Context) => {
  const body = await c.req.json<RegisterUserAndAccountParams>();
  const ctx = createContext();
  const result = await register(body, ctx);

  return result.match(
    (user) => c.json(user, 201),
    (error) => mapErrorToResponse(error, c),
  );
};

const loginHandler = async (c: Context) => {
  const body = await c.req.json<{
    email: string;
    password: string;
  }>();
  const ctx = createContext();
  const result = await login(body, ctx);

  return result.match(
    (token) => c.json(token, 201),
    (error) => mapErrorToResponse(error, c),
  );
};

// --------------------------------
// Router
// --------------------------------

export const authRouter = createRouter()
  .openapi(registerRoute, registerHandler)
  .openapi(loginRoute, loginHandler);
