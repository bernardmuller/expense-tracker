import type { FinancialAccountType } from "../enums/financialAccountType";
import {
  InvalidFinancialAccountNameError,
  InvalidCurrentAmountError,
  FinancialAccountTypeAlreadySetError,
  InvalidAdditionAmountError,
  InvalidSubtractionAmountError,
} from "./financialAccountErrors";
import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";

export type FinancialAccount = {
  readonly id: string;
  type: FinancialAccountType;
  name: string;
  description: string;
  currentAmount: number;
};

export type CreateFinancialAccountParams = Omit<FinancialAccount, "id">;

export const createFinancialAccount = (
  params: CreateFinancialAccountParams,
) => {
  if (params.currentAmount < 0)
    return err(new InvalidCurrentAmountError(params.currentAmount));
  return ok({
    ...params,
    id: generateUuid(),
  });
};

export type UpdateFinancialAccountParams = Partial<
  Pick<FinancialAccount, "name" | "description">
>;

export const updateFinancialAccount = (
  financialAccount: FinancialAccount,
  params: UpdateFinancialAccountParams,
) => {
  if (
    params.name !== undefined &&
    (!params.name || params.name.trim() === "")
  ) {
    return err(new InvalidFinancialAccountNameError(params.name));
  }
  return ok({
    ...financialAccount,
    ...(params.name !== undefined && { name: params.name }),
    ...(params.description !== undefined && {
      description: params.description,
    }),
  });
};

export const changeFinancialAccountType = (
  financialAccount: FinancialAccount,
  type: FinancialAccountType,
) => {
  if (financialAccount.type === type)
    return err(new FinancialAccountTypeAlreadySetError(financialAccount.type));
  return ok({
    ...financialAccount,
    type,
  });
};

export const addToCurrentAmount = (
  financialAccount: FinancialAccount,
  amount: number,
) => {
  if (amount < 0) return err(new InvalidAdditionAmountError(amount));
  return ok({
    ...financialAccount,
    currentAmount: financialAccount.currentAmount + amount,
  });
};

export const subtractFromCurrentAmount = (
  financialAccount: FinancialAccount,
  amount: number,
) => {
  if (amount < 0) return err(new InvalidSubtractionAmountError(amount));
  return ok({
    ...financialAccount,
    currentAmount: financialAccount.currentAmount - amount,
  });
};
