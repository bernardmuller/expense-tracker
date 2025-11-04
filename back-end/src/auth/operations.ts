import * as AccountOperations from "@/accounts/operations";
import { AccountAlreadyExistsError } from "@/accounts/types";
import type { AppContext } from "@/db/context";
import * as UserOperations from "@/users/operations";
import { type ResultAsync, errAsync } from "neverthrow";
import type {
  LoginAttemptParams,
  LoginParams,
  LoginResponse,
  RegisterRequestParams,
  RegisterVerifyParams,
} from "./types";

import { pinoInstance as logger } from "@/http/middleware/logger";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";
import { compareOTP } from "@/lib/utils/compareOTP";
import { decodeVerificationToken } from "@/lib/utils/decodeVerificationToken";
import { generateOTP } from "@/lib/utils/generateOTP";
import { hashOTP } from "@/lib/utils/hashOTP";
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
} from "@/lib/utils/jwt";
import { sendEmail } from "@/smtp/send";
import * as VerificationOperations from "@/verifications/operations";
import {
  ExpiredRefreshTokenError,
  InvalidOTPError,
  InvalidVerificationTokenError,
  JwtGenerationError,
  OTPCompareError,
  OTPGenerationError,
  OTPHashError,
  RefreshTokenDecodeError,
  VerificationCreationError,
  VerificationExpiredError,
  VerificationNotFoundError,
} from "./types";
import type { User } from "@/users/types";

export const loginRequest = (
  params: LoginParams,
  ctx: AppContext,
): ResultAsync<
  string,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof OTPGenerationError>
  | InstanceType<typeof OTPHashError>
  | InstanceType<typeof VerificationCreationError>
  | InstanceType<typeof JwtGenerationError>
  | Error
> =>
  UserOperations.getUserByEmail(params.email, ctx)
    .andThen((user) =>
      generateOTP().map((otp) => ({
        user,
        otp,
      })),
    )
    .andThen(({ user, otp }) =>
      hashOTP(otp).map((hashedOTP) => ({
        user,
        otp,
        hashedOTP,
      })),
    )
    .andThen(({ user, otp, hashedOTP }) => {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      return VerificationOperations.createVerification(
        {
          identifier: user.id,
          value: hashedOTP,
          expiresAt,
        },
        ctx,
      ).map((verification) => ({
        user,
        otp,
        verification,
      }));
    })
    .andThen(({ user, otp, verification }) =>
      generateVerificationToken(user.id, verification.id).map((token) => ({
        user,
        otp,
        token,
      })),
    )
    .andThen(({ user, otp, token }) =>
      sendEmail(otp).map(() => ({
        user,
        otp,
        token,
      })),
    )
    .map(({ token }) => token)
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
          email: params.email,
        },
        "Magic link login request failed",
      );
      return error;
    });

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

export const registerRequest = (
  params: RegisterRequestParams,
  ctx: AppContext,
): ResultAsync<
  string,
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof OTPGenerationError>
  | InstanceType<typeof OTPHashError>
  | InstanceType<typeof VerificationCreationError>
  | InstanceType<typeof JwtGenerationError>
  | InstanceType<typeof EntityReadError>
  | Error
> =>
  UserOperations.getUserByEmail(params.email, ctx)
    .andThen(() => errAsync(new UserEmailAlreadyInUseError(params.email)))
    .orElse((error) =>
      error instanceof EntityNotFoundError ? generateOTP() : errAsync(error),
    )
    .andThen((otp) =>
      hashOTP(otp).map((hashedOTP) => ({
        otp,
        hashedOTP,
      })),
    )
    .andThen(({ otp, hashedOTP }) => {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      return VerificationOperations.createVerification(
        {
          identifier: JSON.stringify({
            email: params.email,
            name: params.name,
          }),
          value: hashedOTP,
          expiresAt,
        },
        ctx,
      ).map((verification) => ({
        otp,
        verification,
      }));
    })
    .andThen(({ otp, verification }) =>
      generateVerificationToken("pending", verification.id).map((token) => ({
        otp,
        token,
      })),
    )
    .andThen(({ otp, token }) => sendEmail(otp).map(() => token))
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
          email: params.email,
        },
        "Registration request failed",
      );
      return error;
    });

export const registerVerify = (
  params: RegisterVerifyParams & { token: string },
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof InvalidVerificationTokenError>
  | InstanceType<typeof VerificationNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof VerificationExpiredError>
  | InstanceType<typeof OTPCompareError>
  | InstanceType<typeof InvalidOTPError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof AccountAlreadyExistsError>
  | InstanceType<typeof JwtGenerationError>
  | Error
> =>
  decodeVerificationToken(params.token)
    .andThen(({ verificationId }) =>
      VerificationOperations.getVerificationById(verificationId, ctx),
    )
    .andThen((verification) => {
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
      }));
    })
    .andThen(({ isMatch, email, name }) =>
      isMatch
        ? UserOperations.createUser({ name, email }, ctx).map((user) => user)
        : errAsync(new InvalidOTPError()),
    )
    .andThen((user) =>
      AccountOperations.createAccount(
        {
          userId: user.id,
        },
        ctx,
      ).map(() => user),
    )
    .andThen((user) => UserOperations.markUserAsVerified(user.id, ctx))
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
