import type { AppContext } from "@/lib/db/context";
import * as UserOperations from "@/features/users/actions";
import { type ResultAsync, errAsync } from "neverthrow";
import type { RegisterVerifyParams, RegisterVerifyResponse } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";
import { compareOTP } from "@/lib/utils/compareOTP";
import { decodeVerificationToken } from "@/lib/utils/decodeVerificationToken";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";
import * as VerificationOperations from "@/features/verifications/operations";
import {
  InvalidOTPError,
  InvalidVerificationTokenError,
  JwtGenerationError,
  OTPCompareError,
  VerificationExpiredError,
  VerificationNotFoundError,
} from "../types";

export const registerVerify = (
  params: RegisterVerifyParams & { token: string },
  ctx: AppContext,
): ResultAsync<
  RegisterVerifyResponse,
  | InstanceType<typeof InvalidVerificationTokenError>
  | InstanceType<typeof VerificationNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof VerificationExpiredError>
  | InstanceType<typeof OTPCompareError>
  | InstanceType<typeof InvalidOTPError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof JwtGenerationError>
  | Error
> =>
  decodeVerificationToken(params.token)
    .andThen(({ verificationId }) =>
      VerificationOperations.getVerificationById(verificationId, ctx).map(
        (verification) => ({
          verification,
          verificationId,
        }),
      ),
    )
    .andThen(({ verification, verificationId }) => {
      const now = new Date();
      if (verification.expiresAt < now) {
        return errAsync(new VerificationExpiredError());
      }

      let userData: { email: string; name: string };
      try {
        userData = JSON.parse(verification.identifier);
      } catch {
        return errAsync(
          new InvalidVerificationTokenError("Invalid verification data"),
        );
      }

      return compareOTP(params.otp, verification.value).map((isMatch) => ({
        isMatch,
        email: userData.email,
        name: userData.name,
        verificationId,
      }));
    })
    .andThen(({ isMatch, email, name, verificationId }) =>
      isMatch
        ? UserOperations.createUser({ name, email }).map((user) => ({
            user,
            verificationId,
          }))
        : errAsync(new InvalidOTPError()),
    )
    .andThen(({ user, verificationId }) =>
      UserOperations.markUserAsVerified(user.id).map(() => ({
        user,
        verificationId,
      })),
    )
    .andThen(({ user, verificationId }) =>
      generateAccessToken(user.id, user.email, user.name).andThen(
        (accessToken) =>
          generateRefreshToken(user.id, user.email, user.name).andThen(
            (refreshToken) =>
              VerificationOperations.deleteVerification(
                verificationId,
                ctx,
              ).map(() => ({
                user,
                accessToken,
                refreshToken,
              })),
          ),
      ),
    )
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
        },
        "Registration verification failed",
      );
      return error;
    });
