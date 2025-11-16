import bcrypt from "bcrypt";
import { ResultAsync } from "neverthrow";
import { OTPHashError } from "@/features/auth/types";

const SALT_ROUNDS = 10;

export const hashOTP = (
  otp: string,
): ResultAsync<string, InstanceType<typeof OTPHashError>> =>
  ResultAsync.fromPromise(
    bcrypt.hash(otp, SALT_ROUNDS),
    (error) => new OTPHashError(String(error)),
  );
