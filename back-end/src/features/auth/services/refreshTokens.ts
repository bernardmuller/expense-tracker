import type { AppContext } from "@/lib/db/context";
import * as UserServices from "@/features/users/services";
import type { LoginResponse } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/utils/jwt";
import { AppResult } from "@/lib/result";

export const refreshTokens = (
  refreshToken: string,
  ctx: AppContext,
): AppResult<LoginResponse> =>
  decodeRefreshToken(refreshToken)
    .andThen((payload) =>
      UserServices.getUserById(payload.userId, ctx).map((user) => ({
        user,
        payload,
      })),
    )
    .andThen(({ user }) =>
      generateAccessToken(user.id, user.email, user.name).andThen(
        (accessToken) =>
          generateRefreshToken(user.id, user.email, user.name).map(
            (refreshToken) => ({
              accessToken,
              refreshToken,
            }),
          ),
      ),
    )
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
        },
        "Token refresh failed",
      );
      return error;
    });
