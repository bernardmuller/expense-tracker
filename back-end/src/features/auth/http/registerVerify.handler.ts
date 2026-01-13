import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { registerVerify } from "../operations";
import { MissingAuthorizationHeaderError, InvalidAuthorizationHeaderError } from "../types";

export const registerVerifyHandler = async (c: Context) => {
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
