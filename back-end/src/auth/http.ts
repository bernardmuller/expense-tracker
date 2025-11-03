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
import {
  loginEmailAndPassword,
  loginRequest,
  loginAttempt,
  register,
  refreshTokens,
} from "./operations";
import {
  loginResponseSchema,
  loginRequestResponseSchema,
  registerUserAndAccountSchema,
  type RegisterUserAndAccountParams,
  loginEmailAndPasswordSchema,
  loginRequestSchema,
  loginAttemptSchema,
  MissingAuthorizationHeaderError,
  InvalidAuthorizationHeaderError,
} from "./types";

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

const loginRequestRoute = createRoute({
  path: "/login/request",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      loginRequestSchema,
      "Request magic link login with email",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginRequestResponseSchema,
      "OTP sent successfully, returns verification token",
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

const loginAttemptRoute = createRoute({
  path: "/login/verify",
  method: "post",
  tags,
  security: [{ Bearer: [] }],
  request: {
    body: jsonContentRequired(
      loginAttemptSchema,
      "Verify OTP and get access tokens",
    ),
    headers: z.object({
      authorization: z
        .string()
        .regex(/^Bearer .+$/)
        .describe("Verification token in format: Bearer <token>"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginResponseSchema,
      "OTP verified successfully, user logged in",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      "Missing/invalid authorization header, invalid or expired OTP",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Verification not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const refreshRoute = createRoute({
  path: "/refresh",
  method: "post",
  tags,
  security: [{ Bearer: [] }],
  request: {
    headers: z.object({
      authorization: z
        .string()
        .regex(/^Bearer .+$/)
        .describe("Refresh token in format: Bearer <token>"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginResponseSchema,
      "Tokens refreshed successfully, returns new access and refresh tokens",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      "Missing/invalid authorization header, expired or invalid refresh token",
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

const registerHandler = async (c: Context) => {
  const body = await c.req.json<RegisterUserAndAccountParams>();
  const ctx = createContext();
  const result = await register(body, ctx);

  return result.match(
    (user) => c.json(user, 201),
    (error) => mapErrorToResponse(error, c),
  );
};

const loginEmailAndPasswordHandler = async (c: Context) => {
  const body = await c.req.json<{
    email: string;
    password: string;
  }>();
  const ctx = createContext();
  const result = await loginEmailAndPassword(body, ctx);

  return result.match(
    (tokens) => c.json(tokens, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const loginRequestHandler = async (c: Context) => {
  const body = await c.req.json<{
    email: string;
  }>();
  const ctx = createContext();
  const result = await loginRequest(body, ctx);

  return result.match(
    (token) => c.json({ token }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const loginAttemptHandler = async (c: Context) => {
  const body = await c.req.json<{
    otp: string;
  }>();

  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    const error = new MissingAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  if (!authHeader.startsWith("Bearer ")) {
    const error = new InvalidAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  const token = authHeader.substring(7);

  if (!token) {
    const error = new InvalidAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  const ctx = createContext();
  const result = await loginAttempt({ otp: body.otp, token }, ctx);

  return result.match(
    (tokens) => c.json(tokens, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const refreshHandler = async (c: Context) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    const error = new MissingAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  if (!authHeader.startsWith("Bearer ")) {
    const error = new InvalidAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  const refreshToken = authHeader.substring(7);
  if (!refreshToken) {
    const error = new InvalidAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  const ctx = createContext();
  const result = await refreshTokens(refreshToken, ctx);

  return result.match(
    (tokens) => c.json(tokens, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

// --------------------------------
// Router
// --------------------------------

export const authRouter = createRouter()
  .openapi(registerRoute, registerHandler)
  .openapi(loginRequestRoute, loginRequestHandler)
  .openapi(loginAttemptRoute, loginAttemptHandler)
  .openapi(refreshRoute, refreshHandler);
