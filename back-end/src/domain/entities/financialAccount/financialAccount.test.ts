import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import {
  generateMockFinancialAccount,
  mockFinancialAccounts,
} from "../__mocks__/financialAccount.mock";
import { financialAccountType } from "../enums/financialAccountType";
import {
  FinancialAccountTypeAlreadySetError,
  InvalidAdditionAmountError,
  InvalidCurrentAmountError,
  InvalidFinancialAccountNameError,
  InvalidSubtractionAmountError,
} from "./financialAccountErrors";
import {
  addToCurrentAmount,
  changeFinancialAccountType,
  createFinancialAccount,
  subtractFromCurrentAmount,
  updateFinancialAccount,
  type CreateFinancialAccountParams,
} from "./index";

describe("createFinancialAccount", () => {
  let mock: CreateFinancialAccountParams;

  beforeEach(() => {
    mock = {
      type: "bank",
      name: faker.finance.accountName(),
      description: faker.lorem.sentence(),
      currentAmount: faker.number.float({ min: 0, max: 10000 }),
    };
  });

  it("should create a financialAccount with the provided properties", () => {
    const result = createFinancialAccount(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.type).toBe(mock.type);
      expect(result.value.name).toBe(mock.name);
      expect(result.value.description).toBe(mock.description);
      expect(result.value.currentAmount).toBe(mock.currentAmount);
    }
  });

  it("should create a financialAccount with an id", () => {
    const result = createFinancialAccount(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBeTruthy();
    }
  });

  it("should fail when currentAmount is negative", () => {
    const invalidMock = { ...mock, currentAmount: -100 };
    const result = createFinancialAccount(invalidMock);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidCurrentAmountError);
    }
  });
});

describe("updateFinancialAccount", () => {
  it("should update the name of a financialAccount", () => {
    const financialAccounts = mockFinancialAccounts(5);
    for (const account of financialAccounts) {
      const newName = faker.finance.accountName();
      const result = updateFinancialAccount(account, {
        name: newName,
      });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.name).toBe(newName);
      }
    }
  });

  it("should update the description of a financialAccount", () => {
    const financialAccounts = mockFinancialAccounts(5);
    for (const account of financialAccounts) {
      const newDescription = faker.lorem.sentence();
      const result = updateFinancialAccount(account, {
        description: newDescription,
      });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.description).toBe(newDescription);
      }
    }
  });

  it("should update multiple fields at once", () => {
    const account = generateMockFinancialAccount();
    const newName = faker.finance.accountName();
    const newDescription = faker.lorem.sentence();

    const result = updateFinancialAccount(account, {
      name: newName,
      description: newDescription,
    });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe(newName);
      expect(result.value.description).toBe(newDescription);
    }
  });

  it("should not modify fields that are not provided", () => {
    const account = generateMockFinancialAccount();
    const originalDescription = account.description;
    const newName = faker.finance.accountName();

    const result = updateFinancialAccount(account, { name: newName });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe(newName);
      expect(result.value.description).toBe(originalDescription);
    }
  });

  it("should fail when name is empty", () => {
    const account = generateMockFinancialAccount();
    const result = updateFinancialAccount(account, { name: "" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidFinancialAccountNameError);
    }
  });

  it("should fail when name is only whitespace", () => {
    const account = generateMockFinancialAccount();
    const result = updateFinancialAccount(account, { name: "   " });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidFinancialAccountNameError);
    }
  });
});

describe("changeFinancialAccountType", () => {
  it("should change the type of a financialAccount", () => {
    const account = generateMockFinancialAccount({
      type: financialAccountType.crypto,
    });
    const result = changeFinancialAccountType(
      account,
      financialAccountType.bank,
    );
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.type).toBe(financialAccountType.bank);
    }
  });

  it("should error if the type is already of the provided type", () => {
    const account = generateMockFinancialAccount({
      type: financialAccountType.crypto,
    });
    const result = changeFinancialAccountType(
      account,
      financialAccountType.crypto,
    );
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(FinancialAccountTypeAlreadySetError);
    }
  });
});

describe("addToCurrentAmount", () => {
  it("should add to the current amount", () => {
    const account = generateMockFinancialAccount({ currentAmount: 1000 });
    const result = addToCurrentAmount(account, 500);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentAmount).toBe(1500);
    }
  });

  it("should fail when amount is negative", () => {
    const account = generateMockFinancialAccount();
    const result = addToCurrentAmount(account, -100);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidAdditionAmountError);
    }
  });
});

describe("subtractFromCurrentAmount", () => {
  it("should subtract from the current amount", () => {
    const account = generateMockFinancialAccount({ currentAmount: 1000 });
    const result = subtractFromCurrentAmount(account, 300);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentAmount).toBe(700);
    }
  });

  it("should allow currentAmount to go negative", () => {
    const account = generateMockFinancialAccount({ currentAmount: 100 });
    const result = subtractFromCurrentAmount(account, 200);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentAmount).toBe(-100);
    }
  });

  it("should fail when amount is negative", () => {
    const account = generateMockFinancialAccount();
    const result = subtractFromCurrentAmount(account, -100);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidSubtractionAmountError);
    }
  });
});
