export type Expense = {
  readonly id: number;
  readonly budgetId: number;
  description: string;
  amount: number;
  category: string;
};
