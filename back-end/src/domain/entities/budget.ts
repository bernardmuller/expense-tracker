export type Budget = {
  readonly id: number;
  readonly userId: string;
  name: string;
  startAmount: number;
  currentAmount: number;
  isActive: boolean;
  deletedAt?: string;
  updatedAt?: string;
};
