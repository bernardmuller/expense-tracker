import bcrypt from "bcrypt";
import { ResultAsync } from "neverthrow";
import { OTPCompareError } from "@/features/auth/types";

export const compareOTP = (
  plainOTP: string,
  hashedOTP: string,
): ResultAsync<boolean, InstanceType<typeof OTPCompareError>> =>
  ResultAsync.fromPromise(
    bcrypt.compare(plainOTP, hashedOTP),
    (error) => new OTPCompareError(String(error)),
  );
