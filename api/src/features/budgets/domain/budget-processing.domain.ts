import { ResultAsync, okAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";
import { AppResult, fromEncryption, success } from "@/lib/result";
import { EncryptionError, ValidationError } from "@/lib/errors/domain";
import { decrypt, isEncrypted, encrypt } from "@/lib/utils/encryption";

// Pure domain function: decrypt budget amounts
export const decryptBudgetAmounts = (
  budget: Budget,
): AppResult<{ currentAmount: string; startAmount: string }, EncryptionError> => {
  const decryptCurrentResult = isEncrypted(
    budget.currentAmount,
    budget.ca_iv,
    budget.ca_tag,
  )
    ? decrypt(budget.currentAmount, budget.ca_iv!, budget.ca_tag!)
    : success(budget.currentAmount);

  const decryptStartResult = isEncrypted(
    budget.startAmount,
    budget.sa_iv,
    budget.sa_tag,
  )
    ? decrypt(budget.startAmount, budget.sa_iv!, budget.sa_tag!)
    : success(budget.startAmount);

  return ResultAsync.combine([decryptCurrentResult, decryptStartResult]).map(
    ([currentAmount, startAmount]) => ({
      currentAmount,
      startAmount,
    }),
  );
};

// Pure domain function: calculate category spending breakdown
export const calculateCategoryBreakdown = (
  expenses: Array<{
    categoryId: string;
    amount: string;
    category: { id: string; key: string; label: string; icon: string };
  }>,
  categoryBudgets: Array<{
    categoryId: string;
    allocatedAmount: string;
    category: { id: string; key: string; label: string; icon: string };
  }>,
): Array<{
  id: string;
  key: string;
  label: string;
  icon: string;
  spent: string;
  allocated: string | null;
}> => {
  const categoryMap = new Map<
    string,
    {
      id: string;
      key: string;
      label: string;
      icon: string;
      spent: number;
      allocated: number | null;
    }
  >();

  expenses.forEach((expense) => {
    const existing = categoryMap.get(expense.categoryId);
    const spentAmount = parseFloat(expense.amount);

    if (existing) {
      existing.spent += spentAmount;
    } else {
      categoryMap.set(expense.categoryId, {
        id: expense.category.id,
        key: expense.category.key,
        label: expense.category.label,
        icon: expense.category.icon,
        spent: spentAmount,
        allocated: null,
      });
    }
  });

  categoryBudgets.forEach((categoryBudget) => {
    const existing = categoryMap.get(categoryBudget.categoryId);
    const allocatedAmount = parseFloat(categoryBudget.allocatedAmount);

    if (existing) {
      existing.allocated = allocatedAmount;
    } else {
      categoryMap.set(categoryBudget.categoryId, {
        id: categoryBudget.category.id,
        key: categoryBudget.category.key,
        label: categoryBudget.category.label,
        icon: categoryBudget.category.icon,
        spent: 0,
        allocated: allocatedAmount,
      });
    }
  });

  return Array.from(categoryMap.values())
    .filter(
      (category) =>
        category.spent > 0 || (category.allocated && category.allocated > 0),
    )
    .map((category) => ({
      id: category.id,
      key: category.key,
      label: category.label,
      icon: category.icon,
      spent: category.spent.toFixed(2),
      allocated:
        category.allocated !== null ? category.allocated.toFixed(2) : null,
    }));
};

// Pure domain function: encrypt budget amounts
export const encryptBudgetAmounts = (
  budget: Budget,
): AppResult<Budget, EncryptionError> => {
  const encryptStartResult = encrypt(budget.startAmount);
  const encryptCurrentResult = encrypt(budget.currentAmount);

  return ResultAsync.combine([encryptStartResult, encryptCurrentResult]).map(
    ([startEncrypted, currentEncrypted]) => ({
      ...budget,
      startAmount: startEncrypted.ciphertext,
      currentAmount: currentEncrypted.ciphertext,
      sa_iv: startEncrypted.iv,
      sa_tag: startEncrypted.tag,
      ca_iv: currentEncrypted.iv,
      ca_tag: currentEncrypted.tag,
    }),
  );
};

// Pure domain function: subtract amount from budget current amount
export const subtractFromBudgetCurrentAmount = (
  budget: Budget,
  amount: number,
): AppResult<Budget, ValidationError> => {
  const currentAmount = parseFloat(budget.currentAmount);
  const newAmount = currentAmount - amount;

  if (newAmount < 0) {
    return okAsync({
      ...budget,
      currentAmount: newAmount.toFixed(2),
    });
  }

  return okAsync({
    ...budget,
    currentAmount: newAmount.toFixed(2),
  });
};

// Pure domain function: add amount to budget current amount
export const addToBudgetCurrentAmount = (
  budget: Budget,
  amount: number,
): AppResult<Budget> => {
  const currentAmount = parseFloat(budget.currentAmount);
  const newAmount = currentAmount + amount;

  return okAsync({
    ...budget,
    currentAmount: newAmount.toFixed(2),
  });
};
