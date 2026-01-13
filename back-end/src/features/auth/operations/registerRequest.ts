import type { AppContext } from "@/lib/db/context";
import * as UserOperations from "@/features/users/operations";
import { type ResultAsync, errAsync } from "neverthrow";
import type { RegisterRequestParams } from "../types";
import { pinoInstance as logger } from "@/lib/http/middleware/logger";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";
import { generateOTP } from "@/lib/utils/generateOTP";
import { hashOTP } from "@/lib/utils/hashOTP";
import { generateVerificationToken } from "@/lib/utils/jwt";
import { sendOtpEmail } from "@/lib/smtp/sendOtpEmail";
import * as VerificationOperations from "@/features/verifications/operations";
import {
  OTPHashError,
  VerificationCreationError,
  JwtGenerationError,
} from "../types";

export const registerRequest = (
  params: RegisterRequestParams,
  ctx: AppContext,
): ResultAsync<
  string,
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof OTPHashError>
  | InstanceType<typeof VerificationCreationError>
  | InstanceType<typeof JwtGenerationError>
  | InstanceType<typeof EntityReadError>
  | Error
> =>
  UserOperations.getUserByEmail(params.email, ctx)
    .andThen(() => errAsync(new UserEmailAlreadyInUseError(params.email)))
    .orElse((error) => {
      if (error instanceof EntityNotFoundError) {
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
