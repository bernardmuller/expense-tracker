import bcrypt from "bcrypt";
import { AppResult, fromDB } from "@/lib/result";
import { AuthenticationError } from "@/lib/errors/domain";
import { ResultAsync } from "neverthrow";

export const compareOTP = (
  plainOTP: string,
  hashedOTP: string,
): AppResult<boolean, AuthenticationError> =>
  ResultAsync.fromPromise(
    bcrypt.compare(plainOTP, hashedOTP),
    (error) => new AuthenticationError(`OTP comparison failed: ${String(error)}`),
  );
