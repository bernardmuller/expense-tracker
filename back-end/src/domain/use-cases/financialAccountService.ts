import type {
  CreateFinancialAccountParams,
  FinancialAccount,
  UpdateFinancialAccountParams,
} from "@/domain/entities/financialAccount";
import type { FinancialAccountType } from "@/domain/entities/enums/financialAccountType";
import type { FinancialAccountValidationError } from "@/domain/entities/financialAccount/financialAccountErrors";
import type { Result } from "neverthrow";

export interface FinancialAccountService {
  readonly createFinancialAccount: (
    params: CreateFinancialAccountParams,
  ) => Result<FinancialAccount, FinancialAccountValidationError>;
  readonly updateFinancialAccount: (
    financialAccount: FinancialAccount,
    params: UpdateFinancialAccountParams,
  ) => Result<FinancialAccount, FinancialAccountValidationError>;
  readonly changeFinancialAccountType: (
    financialAccount: FinancialAccount,
    type: FinancialAccountType,
  ) => Result<FinancialAccount, FinancialAccountValidationError>;
  readonly addToCurrentAmount: (
    financialAccount: FinancialAccount,
    amount: number,
  ) => Result<FinancialAccount, FinancialAccountValidationError>;
  readonly subtractFromCurrentAmount: (
    financialAccount: FinancialAccount,
    amount: number,
  ) => Result<FinancialAccount, FinancialAccountValidationError>;
}
