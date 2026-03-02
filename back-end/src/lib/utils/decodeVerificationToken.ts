import jwt from "jsonwebtoken";
import { AppResult } from "@/lib/result";
import { AuthenticationError } from "@/lib/errors/domain";
import { ResultAsync } from "neverthrow";

type VerificationTokenPayload = {
  userId: string;
  verificationId: string;
};

const getJwtSecret = (): string => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not defined in environment variables");
  }
  return secret;
};

export const decodeVerificationToken = (
  token: string,
): AppResult<VerificationTokenPayload, AuthenticationError> =>
  ResultAsync.fromPromise(
    (async () => {
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret) as VerificationTokenPayload;

      if (!decoded.userId || !decoded.verificationId) {
        throw new Error(
          "Invalid token payload: missing userId or verificationId",
        );
      }

      return decoded;
    })(),
    (error) => new AuthenticationError(`Verification token decode failed: ${String(error)}`),
  );
