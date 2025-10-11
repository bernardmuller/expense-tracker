import type { Context as HonoContext } from "hono";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/domain/errors/repositoryErrors";
import {
  MissingRequiredFieldsError as UserMissingFieldsError,
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "@/domain/entities/user/userErrors";
import {
  InvalidTransactionUpdateError,
  MissingRequiredFieldsError as TransactionMissingFieldsError,
} from "@/domain/entities/transaction/transactionErrors";
import {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  BudgetNotActiveError,
  BudgetNotFoundError,
  InvalidBudgetNameError,
  InvalidStartAmountError,
  MissingRequiredFieldsError as BudgetMissingFieldsError,
} from "@/domain/entities/budget/budgetErrors";

/**
 * Maps application errors to HTTP responses
 * This centralizes error handling and ensures consistent error responses
 */
export function mapErrorToHttpResponse(error: unknown, c: HonoContext) {
  // Repository Errors
  if (error instanceof EntityNotFoundError) {
    return c.json(
      {
        error: "Not Found",
        message: error.message || `${error.entityType} with id ${error.id} not found`,
        code: "ENTITY_NOT_FOUND",
      },
      404,
    );
  }

  if (error instanceof EntityCreateError) {
    return c.json(
      {
        error: "Failed to Create",
        message: error.message || `Failed to create ${error.entityType}`,
        code: "ENTITY_CREATE_ERROR",
      },
      500,
    );
  }

  if (error instanceof EntityUpdateError) {
    return c.json(
      {
        error: "Failed to Update",
        message: error.message || `Failed to update ${error.entityType}`,
        code: "ENTITY_UPDATE_ERROR",
      },
      500,
    );
  }

  if (error instanceof EntityDeleteError) {
    return c.json(
      {
        error: "Failed to Delete",
        message: error.message || `Failed to delete ${error.entityType}`,
        code: "ENTITY_DELETE_ERROR",
      },
      500,
    );
  }

  if (error instanceof EntityReadError) {
    return c.json(
      {
        error: "Failed to Read",
        message: error.message || `Failed to read ${error.entityType}`,
        code: "ENTITY_READ_ERROR",
      },
      500,
    );
  }

  // User Validation Errors
  if (error instanceof UserMissingFieldsError) {
    return c.json(
      {
        error: "Validation Error",
        message: "Missing required fields",
        fields: error.fields,
        code: "MISSING_REQUIRED_FIELDS",
      },
      400,
    );
  }

  if (error instanceof UserAlreadyOnboardedError) {
    return c.json(
      {
        error: "Validation Error",
        message: `User ${error.userId} is already onboarded`,
        code: "USER_ALREADY_ONBOARDED",
      },
      400,
    );
  }

  if (error instanceof UserAlreadyVerifiedError) {
    return c.json(
      {
        error: "Validation Error",
        message: `User ${error.userId} is already verified`,
        code: "USER_ALREADY_VERIFIED",
      },
      400,
    );
  }

  // Transaction Validation Errors
  if (error instanceof TransactionMissingFieldsError) {
    return c.json(
      {
        error: "Validation Error",
        message: "Missing required fields",
        fields: error.fields,
        code: "MISSING_REQUIRED_FIELDS",
      },
      400,
    );
  }

  if (error instanceof InvalidTransactionUpdateError) {
    return c.json(
      {
        error: "Validation Error",
        message: `Invalid transaction update: ${error.reason}`,
        code: "INVALID_TRANSACTION_UPDATE",
      },
      400,
    );
  }

  // Budget Validation Errors
  if (error instanceof BudgetMissingFieldsError) {
    return c.json(
      {
        error: "Validation Error",
        message: "Missing required fields",
        fields: error.fields,
        code: "MISSING_REQUIRED_FIELDS",
      },
      400,
    );
  }

  if (error instanceof InvalidStartAmountError) {
    return c.json(
      {
        error: "Validation Error",
        message: `Invalid start amount: ${error.amount}`,
        code: "INVALID_START_AMOUNT",
      },
      400,
    );
  }

  if (error instanceof InvalidBudgetNameError) {
    return c.json(
      {
        error: "Validation Error",
        message: `Invalid budget name: ${error.name}`,
        code: "INVALID_BUDGET_NAME",
      },
      400,
    );
  }

  if (error instanceof BudgetAlreadyActiveError) {
    return c.json(
      {
        error: "Validation Error",
        message: `Budget ${error.budgetId} is already active`,
        code: "BUDGET_ALREADY_ACTIVE",
      },
      400,
    );
  }

  if (error instanceof BudgetAlreadyInActiveError) {
    return c.json(
      {
        error: "Validation Error",
        message: `Budget ${error.budgetId} is already inactive`,
        code: "BUDGET_ALREADY_INACTIVE",
      },
      400,
    );
  }

  if (error instanceof BudgetNotActiveError) {
    return c.json(
      {
        error: "Validation Error",
        message: `Budget ${error.id} is not active`,
        code: "BUDGET_NOT_ACTIVE",
      },
      400,
    );
  }

  if (error instanceof BudgetNotFoundError) {
    return c.json(
      {
        error: "Not Found",
        message: `Budget with id ${error.id} not found`,
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
