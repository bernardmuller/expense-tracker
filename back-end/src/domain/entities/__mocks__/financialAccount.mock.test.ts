import { describe, it, expect } from "vitest";
import { generateMockFinancialAccount } from "./financialAccount.mock";
import { financialAccountType } from "../enums/financialAccountType";

describe("generateMockFinancialAccount", () => {
  it("should generate a financialAccount with all required properties", () => {
    const result = generateMockFinancialAccount();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("currentAmount");
    expect(result).toHaveProperty("deletedAt");
    expect(result).toHaveProperty("updatedAt");
  });

  it("should apply overwrites to generated financialAccount", () => {
    const customName = "Custom Savings Account";
    const customAmount = 5000;
    const result = generateMockFinancialAccount({
      name: customName,
      currentAmount: customAmount,
      type: "bank",
    });

    expect(result.name).toBe(customName);
    expect(result.currentAmount).toBe(customAmount);
    expect(result.type).toBe("bank");
  });

  it("should generate a valid financial account type", () => {
    const result = generateMockFinancialAccount();
    const validTypes = Object.values(financialAccountType);

    expect(validTypes).toContain(result.type);
  });
});
