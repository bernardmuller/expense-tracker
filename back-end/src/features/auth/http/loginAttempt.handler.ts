import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { loginAttempt } from "../operations";
import { MissingAuthorizationHeaderError, InvalidAuthorizationHeaderError } from "../types";

export const loginAttemptHandler = async (c: Context) => {
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
