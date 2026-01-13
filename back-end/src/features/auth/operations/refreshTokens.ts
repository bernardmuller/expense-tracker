import type { AppContext } from "@/lib/db/context";
import * as UserOperations from "@/features/users/operations";
import { type ResultAsync } from "neverthrow";
import type { LoginResponse } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/utils/jwt";
import {
  ExpiredRefreshTokenError,
  RefreshTokenDecodeError,
  JwtGenerationError,
} from "../types";

export const refreshTokens = (
  refreshToken: string,
  ctx: AppContext,
): ResultAsync<
  LoginResponse,
  | InstanceType<typeof RefreshTokenDecodeError>
  | InstanceType<typeof ExpiredRefreshTokenError>
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof JwtGenerationError>
> =>
  decodeRefreshToken(refreshToken)
    .andThen((payload) =>
      UserOperations.getUserById(payload.userId, ctx).map((user) => ({
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
