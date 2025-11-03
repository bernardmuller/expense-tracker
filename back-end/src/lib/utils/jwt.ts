import jwt from "jsonwebtoken";
import { ResultAsync } from "neverthrow";
import {
  JwtGenerationError,
  RefreshTokenDecodeError,
  ExpiredRefreshTokenError,
  AccessTokenDecodeError,
  ExpiredAccessTokenError,
} from "@/auth/types";

type TokenPayload = {
  userId: string;
  email: string;
  name: string;
};

type DecodedTokenPayload = {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

const getJwtSecret = (): string => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not defined in environment variables");
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

export const generateVerificationToken = (
  userId: string,
  verificationId: string,
): ResultAsync<string, InstanceType<typeof JwtGenerationError>> =>
  ResultAsync.fromPromise(
    (async () => {
      const payload = { userId, verificationId };
      const secret = getJwtSecret();
      return jwt.sign(payload, secret, { expiresIn: "15m" });
    })(),
    (error) => new JwtGenerationError(String(error)),
  );

export const decodeRefreshToken = (
  token: string,
): ResultAsync<
  TokenPayload,
  | InstanceType<typeof RefreshTokenDecodeError>
  | InstanceType<typeof ExpiredRefreshTokenError>
> =>
  ResultAsync.fromPromise(
    (async () => {
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret) as DecodedTokenPayload;

      if (!decoded.userId || !decoded.email || !decoded.name) {
        throw new Error(
          "Invalid token payload: missing userId, email, or name",
        );
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };
    })(),
    (error) => {
      const errorMessage = String(error);

      // Check if it's an expiration error
      if (
        errorMessage.includes("jwt expired") ||
        errorMessage.includes("TokenExpiredError")
      ) {
        return new ExpiredRefreshTokenError();
      }

      return new RefreshTokenDecodeError(errorMessage);
    },
  );

export const decodeAccessToken = (
  token: string,
): ResultAsync<
  TokenPayload,
  | InstanceType<typeof AccessTokenDecodeError>
  | InstanceType<typeof ExpiredAccessTokenError>
> =>
  ResultAsync.fromPromise(
    (async () => {
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret) as DecodedTokenPayload;

      if (!decoded.userId || !decoded.email || !decoded.name) {
        throw new Error(
          "Invalid token payload: missing userId, email, or name",
        );
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };
    })(),
    (error) => {
      const errorMessage = String(error);

      // Check if it's an expiration error
      if (
        errorMessage.includes("jwt expired") ||
        errorMessage.includes("TokenExpiredError")
      ) {
        return new ExpiredAccessTokenError();
      }

      return new AccessTokenDecodeError(errorMessage);
    },
  );
