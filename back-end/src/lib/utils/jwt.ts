import jwt from "jsonwebtoken";
import { ResultAsync } from "neverthrow";
import { JwtGenerationError } from "@/auth/types";

type TokenPayload = {
  userId: string;
  email: string;
  name: string;
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

export const generateAccessToken = (
  userId: string,
  email: string,
  name: string,
): ResultAsync<string, InstanceType<typeof JwtGenerationError>> =>
  ResultAsync.fromPromise(
    (async () => {
      const payload: TokenPayload = { userId, email, name };
      const secret = getJwtSecret();
      return jwt.sign(payload, secret, { expiresIn: "24h" });
    })(),
    (error) => new JwtGenerationError(String(error)),
  );

export const generateRefreshToken = (
  userId: string,
  email: string,
  name: string,
): ResultAsync<string, InstanceType<typeof JwtGenerationError>> =>
  ResultAsync.fromPromise(
    (async () => {
      const payload: TokenPayload = { userId, email, name };
      const secret = getJwtSecret();
      return jwt.sign(payload, secret, { expiresIn: "7d" });
    })(),
    (error) => new JwtGenerationError(String(error)),
  );
