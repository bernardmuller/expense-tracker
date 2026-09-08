import jwt from "jsonwebtoken";
import { AppResult } from "@/lib/result";
import { AuthenticationError } from "@/lib/errors/domain";
import { ResultAsync } from "neverthrow";

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
): AppResult<string, AuthenticationError> =>
  ResultAsync.fromPromise(
    (async () => {
      const payload: TokenPayload = { userId, email, name };
      const secret = getJwtSecret();
      return jwt.sign(payload, secret, { expiresIn: "24h" });
    })(),
    (error) => new AuthenticationError(`Token generation failed: ${String(error)}`),
  );

export const generateRefreshToken = (
  userId: string,
  email: string,
  name: string,
): AppResult<string, AuthenticationError> =>
  ResultAsync.fromPromise(
    (async () => {
      const payload: TokenPayload = { userId, email, name };
      const secret = getJwtSecret();
      return jwt.sign(payload, secret, { expiresIn: "7d" });
    })(),
    (error) => new AuthenticationError(`Token generation failed: ${String(error)}`),
  );

export const generateVerificationToken = (
  userId: string,
  verificationId: string,
): AppResult<string, AuthenticationError> =>
  ResultAsync.fromPromise(
    (async () => {
      const payload = { userId, verificationId };
      const secret = getJwtSecret();
      return jwt.sign(payload, secret, { expiresIn: "15m" });
    })(),
    (error) => new AuthenticationError(`Token generation failed: ${String(error)}`),
  );

export const decodeRefreshToken = (
  token: string,
): AppResult<TokenPayload, AuthenticationError> =>
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

      if (
        errorMessage.includes("jwt expired") ||
        errorMessage.includes("TokenExpiredError")
      ) {
        return new AuthenticationError("Refresh token has expired");
      }

      return new AuthenticationError(`Token decode failed: ${errorMessage}`);
    },
  );

export const decodeAccessToken = (
  token: string,
): AppResult<TokenPayload, AuthenticationError> =>
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

      if (
        errorMessage.includes("jwt expired") ||
        errorMessage.includes("TokenExpiredError")
      ) {
        return new AuthenticationError("Access token has expired");
      }

      return new AuthenticationError(`Token decode failed: ${errorMessage}`);
    },
  );
