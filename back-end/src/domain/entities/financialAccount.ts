import type { FinancialAccountType } from "./enums/financialAccountType";

export type FinancialAccount = {
  readonly id: string;
  type: FinancialAccountType;
  name: string;
  description: string;
  currentAmount: number;
};
