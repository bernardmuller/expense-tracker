import { AppError } from "@/lib/errors/base";

export class InstanceNotPaidError extends AppError {
  readonly code = "INSTANCE_NOT_PAID";
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(instanceId: string) {
    super(`Recurring expense instance ${instanceId} is not paid`);
  }
}
