import { Effect } from "effect";
import type { FinancialAccountType } from "../enums/financialAccountType";
import {
  MissingRequiredFieldsError,
  FinancialAccountAlreadySoftDeletedError,
  InvalidFinancialAccountNameError,
  InvalidCurrentAmountError,
  FinancialAccountTypeAlreadySetError,
  InvalidAdditionAmountError,
  InvalidSubtractionAmountError,
} from "./financialAccountErrors";
import { generateUuid } from "@/lib/utils/generateUuid";
import { getCurrentISOString } from "@/lib/utils/time";

export type FinancialAccount = {
  readonly id: string;
  type: FinancialAccountType;
  name: string;
  description: string;
  currentAmount: number;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateFinancialAccountParams = Omit<
  FinancialAccount,
  "id" | "deletedAt" | "updatedAt"
>;

export const createFinancialAccount = (
  params: CreateFinancialAccountParams,
): Effect.Effect<
  FinancialAccount,
  MissingRequiredFieldsError | InvalidCurrentAmountError
> =>
  Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!params.type) missingFields.push("type");
    if (!params.name) missingFields.push("name");
    if (!params.description) missingFields.push("description");
    if (params.currentAmount === undefined) missingFields.push("currentAmount");

    if (missingFields.length > 0) {
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );
    }

    if (params.currentAmount < 0) {
      return yield* Effect.fail(
        new InvalidCurrentAmountError({
          amount: params.currentAmount,
        }),
      );
    }

    const uuid = generateUuid();

    return {
      ...params,
      id: uuid,
      deletedAt: undefined,
      updatedAt: undefined,
    };
  });

export type UpdateFinancialAccountParams = Partial<
  Pick<FinancialAccount, "name" | "description">
>;

export const updateFinancialAccount = (
  financialAccount: FinancialAccount,
  params: UpdateFinancialAccountParams,
): Effect.Effect<FinancialAccount, InvalidFinancialAccountNameError> =>
  Effect.gen(function* () {
    if (
      params.name !== undefined &&
      (!params.name || params.name.trim() === "")
    ) {
      return yield* Effect.fail(
        new InvalidFinancialAccountNameError({
          name: params.name,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...financialAccount,
      ...(params.name !== undefined && { name: params.name }),
      ...(params.description !== undefined && {
        description: params.description,
      }),
      updatedAt: now,
    };
  });

export const changeFinancialAccountType = (
  financialAccount: FinancialAccount,
  type: FinancialAccountType,
): Effect.Effect<FinancialAccount, FinancialAccountTypeAlreadySetError> =>
  Effect.gen(function* () {
    if (financialAccount.type === type) {
      return yield* Effect.fail(
        new FinancialAccountTypeAlreadySetError({
          type: financialAccount.type,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...financialAccount,
      type,
      updatedAt: now,
    };
  });

export const addToCurrentAmount = (
  financialAccount: FinancialAccount,
  amount: number,
): Effect.Effect<FinancialAccount, InvalidAdditionAmountError> =>
  Effect.gen(function* () {
    if (amount < 0) {
      return yield* Effect.fail(
        new InvalidAdditionAmountError({
          amount,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...financialAccount,
      currentAmount: financialAccount.currentAmount + amount,
      updatedAt: now,
    };
  });

export const subtractFromCurrentAmount = (
  financialAccount: FinancialAccount,
  amount: number,
): Effect.Effect<FinancialAccount, InvalidSubtractionAmountError> =>
  Effect.gen(function* () {
    if (amount < 0) {
      return yield* Effect.fail(
        new InvalidSubtractionAmountError({
          amount,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...financialAccount,
      currentAmount: financialAccount.currentAmount - amount,
      updatedAt: now,
    };
  });

export const softDeleteFinancialAccount = (
  financialAccount: FinancialAccount,
): Effect.Effect<FinancialAccount, FinancialAccountAlreadySoftDeletedError> =>
  Effect.gen(function* () {
    if (financialAccount.deletedAt) {
      return yield* Effect.fail(
        new FinancialAccountAlreadySoftDeletedError({
          financialAccountId: financialAccount.id,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...financialAccount,
      deletedAt: now,
    };
  });

export const isFinancialAccountSoftDeleted = (
  financialAccount: FinancialAccount,
): boolean => !!financialAccount.deletedAt;
