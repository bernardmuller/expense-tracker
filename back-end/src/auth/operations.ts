import * as AccountOperations from "@/accounts/operations";
import { AccountAlreadyExistsError } from "@/accounts/types";
import type { AppContext } from "@/db/context";
import * as UserOperations from "@/users/operations";
import { type ResultAsync, errAsync } from "neverthrow";
import type {
  LoginParams,
  RegisterUserAndAccountParams,
  LoginResponse,
  LoginRequestParams,
  LoginAttemptParams,
  LoginEmailAndPasswordParams,
} from "./types";

import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";
import { hashPassword } from "@/lib/utils/hashPassword";
import { comparePassword } from "@/lib/utils/comparePassword";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  decodeRefreshToken,
} from "@/lib/utils/jwt";
import { generateOTP } from "@/lib/utils/generateOTP";
import { hashOTP } from "@/lib/utils/hashOTP";
import { compareOTP } from "@/lib/utils/compareOTP";
import { decodeVerificationToken } from "@/lib/utils/decodeVerificationToken";
import {
  PasswordHashError,
  IncorrectPasswordError,
  PasswordCompareError,
  JwtGenerationError,
  InvalidEmailAndOrPasswordError,
  OTPGenerationError,
  OTPHashError,
  VerificationCreationError,
  OTPCompareError,
  InvalidOTPError,
  VerificationExpiredError,
  InvalidVerificationTokenError,
  VerificationNotFoundError,
  ExpiredRefreshTokenError,
  RefreshTokenDecodeError,
} from "./types";
import type { User } from "@/users/types";
import { pinoInstance as logger } from "@/http/middleware/logger";
import { sendEmail } from "@/smtp/send";
import * as VerificationOperations from "@/verifications/operations";

export const register = (
  params: RegisterUserAndAccountParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof AccountAlreadyExistsError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof PasswordHashError>
  | Error
> =>
  UserOperations.createUser(
    {
      name: params.name,
      email: params.email,
    },
    ctx,
  )
    .andThen((user) =>
      hashPassword(params.password).map((hashedPassword) => ({
        user,
        hashedPassword,
      })),
    )
    .andThen(({ user, hashedPassword }) =>
      AccountOperations.createAccount(
        {
          userId: user.id,
          password: hashedPassword,
        },
        ctx,
      ).map(() => user),
    )
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
          email: params.email,
          name: params.name,
        },
        "Registration failed",
      );
      return error;
    });

export const loginEmailAndPassword = (
  params: LoginEmailAndPasswordParams,
  ctx: AppContext,
): ResultAsync<
  LoginResponse,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof IncorrectPasswordError>
  | InstanceType<typeof PasswordCompareError>
  | InstanceType<typeof JwtGenerationError>
  | InstanceType<typeof InvalidEmailAndOrPasswordError>
> =>
  UserOperations.getUserByEmail(params.email, ctx)
    .andThen((user) =>
      AccountOperations.getAccountByUserId(user.id, ctx).map((account) => ({
        user,
        account,
      })),
    )
    .andThen(({ user, account }) =>
      comparePassword(params.password, account.password).andThen((isMatch) =>
        isMatch
          ? generateAccessToken(user.id, user.email, user.name).andThen(
              (accessToken) =>
                generateRefreshToken(user.id, user.email, user.name).map(
                  (refreshToken) => ({
                    accessToken,
                    refreshToken,
                  }),
                ),
            )
          : errAsync(new IncorrectPasswordError()),
      ),
    )
    .orElse((error) =>
      error instanceof EntityNotFoundError || IncorrectPasswordError
        ? errAsync(new InvalidEmailAndOrPasswordError())
        : errAsync(error),
    )
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
          email: params.email,
        },
        "Login with email and password failed",
      );
      return error;
    });

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
