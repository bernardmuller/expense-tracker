import { AppError } from "@/lib/errors/base";

export class InstanceAlreadyPaidError extends AppError {
  readonly code = "INSTANCE_ALREADY_PAID";
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(instanceId: string) {
    super(`Recurring expense instance ${instanceId} is already paid`);
  }
}
