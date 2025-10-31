import bcrypt from "bcrypt";
import { ResultAsync } from "neverthrow";
import { PasswordHashError } from "@/auth/types";

const SALT_ROUNDS = 10;

export const hashPassword = (
  password: string,
): ResultAsync<string, InstanceType<typeof PasswordHashError>> =>
  ResultAsync.fromPromise(
    bcrypt.hash(password, SALT_ROUNDS),
    (error) => new PasswordHashError(String(error)),
  );
