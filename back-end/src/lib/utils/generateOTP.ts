import { ResultAsync } from "neverthrow";
import { OTPGenerationError } from "@/auth/types";

export const generateOTP = (): ResultAsync<
  string,
  InstanceType<typeof OTPGenerationError>
> =>
  ResultAsync.fromSafePromise(
    (async () => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      return otp.toString();
    })(),
  ).mapErr((error) => new OTPGenerationError(String(error)));
