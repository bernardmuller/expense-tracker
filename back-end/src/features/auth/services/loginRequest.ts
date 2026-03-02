import type { AppContext } from "@/lib/db/context";
import * as UserServices from "@/features/users/services";
import type { LoginParams } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import { generateOTP } from "@/lib/utils/generateOTP";
import { hashOTP } from "@/lib/utils/hashOTP";
import { generateVerificationToken } from "@/lib/utils/jwt";
import { sendOtpEmail } from "@/lib/smtp/sendOtpEmail";
import * as VerificationServices from "@/features/verifications/services";
import { AppResult } from "@/lib/result";

export const loginRequest = (
  params: LoginParams,
  ctx: AppContext,
): AppResult<string> =>
  UserServices.getUserByEmail(params.email, ctx)
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

      return VerificationServices.createVerification(
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
