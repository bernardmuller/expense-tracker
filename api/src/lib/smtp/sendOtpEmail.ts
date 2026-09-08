import env from "@/env";
import { EmailError } from "@/lib/errors/domain";
import { AppResult } from "@/lib/result";
import { ResultAsync } from "neverthrow";
import { Resend, type CreateEmailResponse } from "resend";

const resend = new Resend(env.RESEND_KEY);

export const sendOtpEmail = (
  to: string[],
  subject: string,
  otp: string,
): AppResult<CreateEmailResponse, EmailError> =>
  ResultAsync.fromPromise(
    resend.emails.send({
      from: env.MAIL_ADDRESS,
      to,
      subject,
      html: `<p>Your OTP: ${otp}</p>`,
      replyTo: env.MAIL_ADDRESS,
    }),
    (error) => new EmailError(`Failed to send OTP email: ${String(error)}`),
  );
