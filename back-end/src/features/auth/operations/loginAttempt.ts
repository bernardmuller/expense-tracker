import type { AppContext } from "@/lib/db/context";
import * as UserOperations from "@/features/users/operations";
import { type ResultAsync, errAsync } from "neverthrow";
import type { LoginAttemptParams, LoginResponse } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { compareOTP } from "@/lib/utils/compareOTP";
import { decodeVerificationToken } from "@/lib/utils/decodeVerificationToken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/utils/jwt";
import * as VerificationOperations from "@/features/verifications/operations";
import {
  InvalidOTPError,
  InvalidVerificationTokenError,
  JwtGenerationError,
  OTPCompareError,
  VerificationExpiredError,
  VerificationNotFoundError,
} from "../types";

export const loginAttempt = (
  params: LoginAttemptParams,
  ctx: AppContext,
): ResultAsync<
  LoginResponse,
  | InstanceType<typeof InvalidVerificationTokenError>
  | InstanceType<typeof VerificationNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof VerificationExpiredError>
  | InstanceType<typeof OTPCompareError>
  | InstanceType<typeof InvalidOTPError>
  | InstanceType<typeof JwtGenerationError>
  | InstanceType<typeof EntityNotFoundError>
> =>
  decodeVerificationToken(params.token)
    .andThen(({ userId, verificationId }) =>
      VerificationOperations.getVerificationById(verificationId, ctx).map(
        (verification) => ({
          userId,
          verification,
        }),
      ),
    )
    .andThen(({ userId, verification }) => {
      const now = new Date();
      if (verification.expiresAt < now) {
        return errAsync(new VerificationExpiredError());
      }
      return compareOTP(params.otp, verification.value).map((isMatch) => ({
        userId,
        isMatch,
      }));
    })
    .andThen(({ userId, isMatch }) =>
      isMatch
        ? UserOperations.getUserById(userId, ctx)
        : errAsync(new InvalidOTPError()),
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
