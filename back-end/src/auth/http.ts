import { createContext } from "@/db/context";
import { createRouter } from "@/http/createApi";
import { mapErrorToResponse } from "@/http/errorMapper";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  loginAttempt,
  loginRequest,
  refreshTokens,
  registerRequest,
  registerVerify,
} from "./operations";
import {
  InvalidAuthorizationHeaderError,
  loginAttemptSchema,
  loginRequestResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  MissingAuthorizationHeaderError,
  registerRequestSchema,
  registerVerifyParamsSchema,
  registerVerifySchema,
} from "./types";

const tags = ["Auth"];

// --------------------------------
// Route Definitions
// --------------------------------

const registerRequestRoute = createRoute({
  path: "/register/request",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      registerRequestSchema,
      "Request registration with email and name",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loginRequestResponseSchema,
      "OTP sent successfully, returns verification token",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      "Email already in use",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const registerVerifyRoute = createRoute({
  path: "/register/verify",
  method: "post",
  tags,
  security: [{ Bearer: [] }],
  request: {
    body: jsonContentRequired(
      registerVerifyParamsSchema,
      "Verify OTP and complete registration",
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
      registerVerifySchema,
      "Registration completed successfully, user logged in",
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

const registerRequestHandler = async (c: Context) => {
  const body = await c.req.json<{
    name: string;
    email: string;
  }>();
  const ctx = createContext();
  const result = await registerRequest(body, ctx);

  return result.match(
    (token) => c.json({ token }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

const registerVerifyHandler = async (c: Context) => {
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
  const result = await registerVerify({ otp: body.otp, token: token }, ctx);

  return result.match(
    (user) => c.json(user, 200),
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
  .openapi(registerRequestRoute, registerRequestHandler)
  .openapi(registerVerifyRoute, registerVerifyHandler)
  .openapi(loginRequestRoute, loginRequestHandler)
  .openapi(loginAttemptRoute, loginAttemptHandler)
  .openapi(refreshRoute, refreshHandler);
