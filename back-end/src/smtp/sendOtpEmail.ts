import env from "@/env";
import { EmailSendError } from "@/lib/errors/smtpErrors";
import { ResultAsync } from "neverthrow";
import { Resend, type CreateEmailResponse } from "resend";

const resend = new Resend(env.RESEND_KEY);

export const sendOtpEmail = (
  to: string[],
  subject: string,
  otp: string,
): ResultAsync<CreateEmailResponse, InstanceType<typeof EmailSendError>> =>
  ResultAsync.fromPromise(
    resend.emails.send({
      from: env.MAIL_ADDRESS,
      to,
      subject,
      html: `<p>Your OTP: ${otp}</p>`,
      replyTo: env.MAIL_ADDRESS,
    }),
    (error) => new EmailSendError("Failed to send otp email", error),
  );
