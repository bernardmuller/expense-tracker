import type { AppContext } from "@/lib/db/context";
import * as UserOperations from "@/features/users/operations";
import { type ResultAsync } from "neverthrow";
import type { LoginParams } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { generateOTP } from "@/lib/utils/generateOTP";
import { hashOTP } from "@/lib/utils/hashOTP";
import { generateVerificationToken } from "@/lib/utils/jwt";
import { sendOtpEmail } from "@/lib/smtp/sendOtpEmail";
import * as VerificationOperations from "@/features/verifications/operations";
import {
  OTPHashError,
  JwtGenerationError,
  VerificationCreationError,
} from "../types";

export const loginRequest = (
  params: LoginParams,
  ctx: AppContext,
): ResultAsync<
  string,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof OTPHashError>
  | InstanceType<typeof VerificationCreationError>
  | InstanceType<typeof JwtGenerationError>
  | Error
> =>
  UserOperations.getUserByEmail(params.email, ctx)
    .andThen((user) => {
      const otp = generateOTP();
      return hashOTP(String(otp).padStart(6, "0")).map((hashedOTP) => ({
        user,
        otp,
        hashedOTP,
      }));
    })
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
      sendOtpEmail(
        [user.email],
        "Login Request: OTP",
        String(otp).padStart(6, "0"),
      ).map(() => ({
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
