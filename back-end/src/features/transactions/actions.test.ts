import { describe, expect, it } from "vitest";
import { createTransaction } from "./actions";
import {
  subtractFromBudgetCurrentAmount,
  addToBudgetCurrentAmount,
} from "@/features/budgets/actions";
import type { CreateTransactionParams } from "./types";
import type { Budget } from "@/lib/db/schema";

describe("createTransaction", () => {
  it("should create a transaction with valid params", () => {
    const budgetId = "b1234567-89ab-cdef-0123-456789abcdef";
    const params: CreateTransactionParams = {
      description: "Grocery shopping",
      amount: 150.5,
      categoryId: "c1234567-89ab-cdef-0123-456789abcdef",
    };

    const result = createTransaction(budgetId, params);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const transaction = result.value;
      expect(transaction.budgetId).toBe(budgetId);
      expect(transaction.description).toBe(params.description);
      expect(transaction.amount).toBe(params.amount.toString());
      expect(transaction.categoryId).toBe(params.categoryId);
      expect(transaction.id).toBeTruthy();
      expect(transaction.createdAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt).toBeInstanceOf(Date);
      expect(transaction.deletedAt).toBeNull();
    }
  });
});

describe("subtractFromBudgetCurrentAmount", () => {
  it("should decrease budget amount by transaction amount", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "10000.00",
      currentAmount: "8500.00",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await subtractFromBudgetCurrentAmount(budget, 150.5);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const updatedBudget = result.value;
      expect(updatedBudget.currentAmount).toBe("8349.5");
      expect(updatedBudget.startAmount).toBe(budget.startAmount);
      expect(updatedBudget.id).toBe(budget.id);
    }
  });

  it("should allow budget to go negative", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "10000.00",
      currentAmount: "50.00",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await subtractFromBudgetCurrentAmount(budget, 100.0);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const updatedBudget = result.value;
      expect(updatedBudget.currentAmount).toBe("-50");
      expect(parseFloat(updatedBudget.currentAmount)).toBeLessThan(0);
    }
  });

  it("should handle decimal amounts correctly", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "10000.00",
      currentAmount: "1000.00",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await subtractFromBudgetCurrentAmount(budget, 99.99);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const updatedBudget = result.value;
      expect(updatedBudget.currentAmount).toBe("900.01");
    }
  });
});

describe("addToBudgetCurrentAmount", () => {
  it("should increase budget amount by deleted transaction amount", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "10000.00",
      currentAmount: "8500.00",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await addToBudgetCurrentAmount(budget, 150.5);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const updatedBudget = result.value;
      expect(updatedBudget.currentAmount).toBe("8650.5");
      expect(updatedBudget.startAmount).toBe(budget.startAmount);
      expect(updatedBudget.id).toBe(budget.id);
    }
  });

  it("should handle negative budget going back to positive", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "10000.00",
      currentAmount: "-50.00",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await addToBudgetCurrentAmount(budget, 100.0);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const updatedBudget = result.value;
      expect(updatedBudget.currentAmount).toBe("50");
      expect(parseFloat(updatedBudget.currentAmount)).toBeGreaterThan(0);
    }
  });

  it("should handle decimal amounts correctly", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "10000.00",
      currentAmount: "1000.00",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await addToBudgetCurrentAmount(budget, 99.99);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const updatedBudget = result.value;
      expect(updatedBudget.currentAmount).toBe("1099.99");
    }
  });
});
