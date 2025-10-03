export type FinancialAccount = {
  readonly id: string;
  type: FinancialAccount;
  name: string;
  description: string;
  currentAmount: number;
}
