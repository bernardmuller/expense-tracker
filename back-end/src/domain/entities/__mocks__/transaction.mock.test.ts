import { describe, it, expect } from "vitest";
import {
  generateMockTransaction,
  mockExpenseTransactions,
  mockIncomeTransactions,
  mockTransferTransactions,
} from "./transaction.mock";
import { transactionType } from "../enums/TransactionType";

describe("generateMockTransaction", () => {
  it("should generate a transaction with the given transaction type", () => {
    const result = generateMockTransaction(transactionType.expense);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("budgetId");
    expect(result).toHaveProperty("categoryId");
    expect(result).toHaveProperty("amount");
    expect(result.type).toBe(transactionType.expense);
  });
});

describe("mockExpenseTransactions", () => {
  it("should generate default of 10 expense transactions when no count is provided", () => {
    const result = mockExpenseTransactions();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of transactions", () => {
    expect(mockExpenseTransactions(1)).toHaveLength(1);
    expect(mockExpenseTransactions(5)).toHaveLength(5);
    expect(mockExpenseTransactions(20)).toHaveLength(20);
  });

  it("should generate transactions with all required properties", () => {
    const results = mockExpenseTransactions(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("budgetId");
      expect(result).toHaveProperty("categoryId");
      expect(result).toHaveProperty("amount");
      expect(result.type).toBe(transactionType.expense);
    });
  });
});

describe("mockIncomeTransactions", () => {
  it("should generate default of 10 income transactions when no count is provided", () => {
    const result = mockIncomeTransactions();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of transactions", () => {
    expect(mockIncomeTransactions(2)).toHaveLength(2);
    expect(mockIncomeTransactions(9)).toHaveLength(9);
    expect(mockIncomeTransactions(11)).toHaveLength(11);
  });

  it("should generate income transactions with all required properties", () => {
    const results = mockIncomeTransactions(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("budgetId");
      expect(result).toHaveProperty("categoryId");
      expect(result).toHaveProperty("amount");
      expect(result.type).toBe(transactionType.income);
    });
  });
});

describe("mockTransferTransactions", () => {
  it("should generate default of 10 transfer transactions when no count is provided", () => {
    const result = mockTransferTransactions();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of transactions", () => {
    expect(mockTransferTransactions(2)).toHaveLength(2);
    expect(mockTransferTransactions(8)).toHaveLength(8);
    expect(mockTransferTransactions(13)).toHaveLength(13);
  });

  it("should generate transfer transactions with all required properties", () => {
    const results = mockTransferTransactions(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("budgetId");
      expect(result).toHaveProperty("categoryId");
      expect(result).toHaveProperty("amount");
      expect(result.type).toBe(transactionType.transfer);
    });
  });
});
