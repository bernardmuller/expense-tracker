import bcrypt from "bcrypt";
import { AppResult } from "@/lib/result";
import { AuthenticationError } from "@/lib/errors/domain";
import { ResultAsync } from "neverthrow";

const SALT_ROUNDS = 10;

export const hashOTP = (
  otp: string,
): AppResult<string, AuthenticationError> =>
  ResultAsync.fromPromise(
    bcrypt.hash(otp, SALT_ROUNDS),
    (error) => new AuthenticationError(`OTP hashing failed: ${String(error)}`),
  );
