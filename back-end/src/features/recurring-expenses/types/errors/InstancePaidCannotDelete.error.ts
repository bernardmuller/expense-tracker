import { AppError } from "@/lib/errors/base";

export class InstancePaidCannotDeleteError extends AppError {
  readonly code = "INSTANCE_PAID_CANNOT_DELETE";
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(instanceId: string) {
    super(
      `Recurring expense instance ${instanceId} is paid and cannot be deleted; unmark as paid first`,
    );
  }
}
