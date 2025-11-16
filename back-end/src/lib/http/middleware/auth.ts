import type { Context, Next } from "hono";
import { decodeAccessToken } from "@/lib/utils/jwt";
import {
  MissingAuthorizationHeaderError,
  InvalidAuthorizationHeaderError,
} from "@/features/auth/types";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    const error = new MissingAuthorizationHeaderError();
    return c.json(
      {
        code: error.code,
        error: error.error,
        message: error.message,
      },
      401,
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    const error = new InvalidAuthorizationHeaderError();
    return c.json(
      {
        code: error.code,
        error: error.error,
        message: error.message,
      },
      401,
    );
  }

  const token = authHeader.substring(7);

  if (!token) {
    const error = new InvalidAuthorizationHeaderError();
    return c.json(
      {
        code: error.code,
        error: error.error,
        message: error.message,
      },
      401,
    );
  }

  const result = await decodeAccessToken(token);

  return result.match(
    (user) => {
      c.set("user", user);
      return next();
    },
    (error) => {
      return c.json(
        {
          code: error.code,
          error: error.error,
          message: error.message,
        },
        401,
      );
    },
  );
};
