import bcrypt from "bcrypt";
import { ResultAsync } from "neverthrow";
import { PasswordCompareError } from "@/auth/types";

export const comparePassword = (
  plainPassword: string,
  hashedPassword: string,
): ResultAsync<boolean, InstanceType<typeof PasswordCompareError>> =>
  ResultAsync.fromPromise(
    bcrypt.compare(plainPassword, hashedPassword),
    (error) => new PasswordCompareError(String(error)),
  );
