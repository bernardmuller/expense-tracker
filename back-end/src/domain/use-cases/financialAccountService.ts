import { Context, Effect } from "effect";
import type {
  CreateFinancialAccountParams,
  FinancialAccount,
  UpdateFinancialAccountParams,
} from "@/domain/entities/financialAccount";
import type { FinancialAccountType } from "@/domain/entities/enums/financialAccountType";
import type {
  InvalidFinancialAccountNameError,
  MissingRequiredFieldsError,
  InvalidCurrentAmountError,
  FinancialAccountTypeAlreadySetError,
  InvalidAdditionAmountError,
  InvalidSubtractionAmountError,
} from "@/domain/entities/financialAccount/financialAccountErrors";

export interface FinancialAccountServiceShape {
  readonly createFinancialAccount: (
    params: CreateFinancialAccountParams,
  ) => Effect.Effect<
    FinancialAccount,
    MissingRequiredFieldsError | InvalidCurrentAmountError
  >;
  readonly updateFinancialAccount: (
    financialAccount: FinancialAccount,
    params: UpdateFinancialAccountParams,
  ) => Effect.Effect<FinancialAccount, InvalidFinancialAccountNameError>;
  readonly changeFinancialAccountType: (
    financialAccount: FinancialAccount,
    type: FinancialAccountType,
  ) => Effect.Effect<FinancialAccount, FinancialAccountTypeAlreadySetError>;
  readonly addToCurrentAmount: (
    financialAccount: FinancialAccount,
    amount: number,
  ) => Effect.Effect<FinancialAccount, InvalidAdditionAmountError>;
  readonly subtractFromCurrentAmount: (
    financialAccount: FinancialAccount,
    amount: number,
  ) => Effect.Effect<FinancialAccount, InvalidSubtractionAmountError>;
}

export class FinancialAccountService extends Context.Tag(
  "domain/use-cases/financialAccountService",
)<FinancialAccountService, FinancialAccountServiceShape>() {}
