export type CategoryBudget = {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  category: {
    id: string;
    key: string;
    label: string;
    icon: string;
  };
};
