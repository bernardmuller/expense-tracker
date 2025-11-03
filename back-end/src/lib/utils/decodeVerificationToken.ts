import jwt from "jsonwebtoken";
import { ResultAsync } from "neverthrow";
import { InvalidVerificationTokenError } from "@/auth/types";

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
): ResultAsync<
  VerificationTokenPayload,
  InstanceType<typeof InvalidVerificationTokenError>
> =>
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
    (error) => new InvalidVerificationTokenError(String(error)),
  );
