import type { Context as HonoContext } from "hono";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/repositoryErrors";
import {
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "@/domain/entities/user/userErrors";
import { InvalidTransactionUpdateError } from "@/domain/entities/transaction/transactionErrors";
import {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  BudgetNotActiveError,
  BudgetNotFoundError,
  InvalidBudgetNameError,
  InvalidStartAmountError,
} from "@/domain/entities/budget/budgetErrors";

export function mapErrorToHttpResponse(error: unknown, c: HonoContext) {
  if (error instanceof UserAlreadyOnboardedError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "USER_ALREADY_ONBOARDED",
      },
      400,
    );
  }

  if (error instanceof UserAlreadyVerifiedError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "USER_ALREADY_VERIFIED",
      },
      400,
    );
  }

  if (error instanceof InvalidTransactionUpdateError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "INVALID_TRANSACTION_UPDATE",
      },
      400,
    );
  }

  if (error instanceof InvalidStartAmountError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "INVALID_START_AMOUNT",
      },
      400,
    );
  }

  if (error instanceof InvalidBudgetNameError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "INVALID_BUDGET_NAME",
      },
      400,
    );
  }

  if (error instanceof BudgetAlreadyActiveError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "BUDGET_ALREADY_ACTIVE",
      },
      400,
    );
  }

  if (error instanceof BudgetAlreadyInActiveError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "BUDGET_ALREADY_INACTIVE",
      },
      400,
    );
  }

  if (error instanceof BudgetNotActiveError) {
    return c.json(
      {
        error: "Validation Error",
        message: error.message,
        code: "BUDGET_NOT_ACTIVE",
      },
      400,
    );
  }

  if (error instanceof BudgetNotFoundError) {
    return c.json(
      {
        error: "Not Found",
        message: error.message,
        code: "BUDGET_NOT_FOUND",
      },
      404,
    );
  }

  // Generic fallback for unknown errors
  console.error("Unhandled error:", error);
  return c.json(
    {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
      code: "INTERNAL_SERVER_ERROR",
    },
    500,
  );
}
