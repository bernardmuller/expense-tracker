import type { AppContext } from "@/lib/db/context";
import * as UserServices from "@/features/users/services";
import { errAsync } from "neverthrow";
import type { RegisterRequestParams } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import { NotFoundError, ValidationError } from "@/lib/errors/domain";
import { generateOTP } from "@/lib/utils/generateOTP";
import { hashOTP } from "@/lib/utils/hashOTP";
import { generateVerificationToken } from "@/lib/utils/jwt";
import { sendOtpEmail } from "@/lib/smtp/sendOtpEmail";
import * as VerificationServices from "@/features/verifications/services";
import { AppResult } from "@/lib/result";

export const registerRequest = (
  params: RegisterRequestParams,
  ctx: AppContext,
): AppResult<string> =>
  UserServices.getUserByEmail(params.email, ctx)
    .andThen(() =>
      errAsync(
        new ValidationError(`User with email ${params.email} already exists`),
      ),
    )
    .orElse((error) => {
      if (error instanceof NotFoundError) {
        const otp = generateOTP();
        return hashOTP(String(otp).padStart(6, "0")).map((hashedOTP) => ({
          otp,
          hashedOTP,
        }));
      }
      return errAsync(error);
    })
    .andThen(({ otp, hashedOTP }) => {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      return VerificationServices.createVerification(
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
    .andThen(({ otp, token }) =>
      sendOtpEmail(
        [params.email],
        "Registration Request: OTP",
        String(otp).padStart(6, "0"),
      ).map(() => token),
    )
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
