import { Resend, type CreateEmailResponse } from "resend";
import { Err, err, Ok, ResultAsync } from "neverthrow";
import env from "@/env";
import { EmailSendError } from "@/lib/errors/smtpErrors";

const resend = new Resend(env.RESEND_KEY);

export const sendEmail = (
  otp: string,
): ResultAsync<CreateEmailResponse, InstanceType<typeof EmailSendError>> =>
  ResultAsync.fromPromise(
    resend.emails.send({
      from: "onboarding@bernardmuller.co.za",
      to: ["me@bernardmuller.co.za"],
      subject: "Login Attempt: OTP",
      html: `<p>Your OTP: ${otp}</p>`,
      replyTo: "onboarding@bernardmuller.co.za",
    }),
    (error) => new EmailSendError("Failed to send email", error),
  );
