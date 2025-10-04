import type { FinancialAccountType } from "./types/FinancialAccountType";

export type FinancialAccount = {
  readonly id: string;
  type: FinancialAccountType;
  name: string;
  description: string;
  currentAmount: number;
}
