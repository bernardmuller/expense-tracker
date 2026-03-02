import type { AppContext } from "@/lib/db/context";
import * as UserServices from "@/features/users/services";
import { errAsync } from "neverthrow";
import type { LoginAttemptParams, LoginResponse } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import { compareOTP } from "@/lib/utils/compareOTP";
import { decodeVerificationToken } from "@/lib/utils/decodeVerificationToken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/utils/jwt";
import * as VerificationServices from "@/features/verifications/services";
import { AppResult } from "@/lib/result";
import { AuthenticationError } from "@/lib/errors/domain";

export const loginAttempt = (
  params: LoginAttemptParams,
  ctx: AppContext,
): AppResult<LoginResponse> =>
  decodeVerificationToken(params.token)
    .andThen(({ userId, verificationId }) =>
      VerificationServices.getVerificationById(verificationId, ctx).map(
        (verification) => ({
          userId,
          verification,
        }),
      ),
    )
    .andThen(({ userId, verification }) => {
      const now = new Date();
      if (verification.expiresAt < now) {
        return errAsync(new AuthenticationError("Verification has expired"));
      }
      return compareOTP(params.otp, verification.value).map((isMatch) => ({
        userId,
        isMatch,
      }));
    })
    .andThen(({ userId, isMatch }) =>
      isMatch
        ? UserServices.getUserById(userId, ctx)
        : errAsync(new AuthenticationError("Invalid OTP")),
    )
    .andThen((user) =>
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
          token: params.token,
        },
        "OTP verification failed",
      );
      return error;
    });
