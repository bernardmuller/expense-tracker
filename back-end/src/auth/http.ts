import { createRouter } from "@/http/createApi";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import type { Context } from "hono";
import { createContext } from "@/db/context";
import { createUser } from "@/users/operations";
import { createUserSchema, userSchema } from "@/users/types";
import type { CreateUserParams } from "@/users/types";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { mapErrorToResponse } from "@/http/errorMapper";

const tags = ["Auth"];

// --------------------------------
// Route Definitions
// --------------------------------

const registerRoute = createRoute({
  path: "/register",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createUserSchema, "Register a new user"),
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

// --------------------------------
// Handlers
// --------------------------------

const registerHandler = async (c: Context) => {
  const body = await c.req.json<CreateUserParams>();
  const ctx = createContext();
  const result = await createUser(body, ctx);

  return result.match(
    (user) => c.json(user, 201),
    (error) => mapErrorToResponse(error, c),
  );
};

// --------------------------------
// Router
// --------------------------------

export const authRouter = createRouter().openapi(
  registerRoute,
  registerHandler,
);
