import { describe, expect, it } from "vitest";
import {
  subtractFromBudgetCurrentAmount,
  addToBudgetCurrentAmount,
  encryptBudgetAmounts,
} from "./actions";
import type { Budget } from "@/lib/db/schema";
import { isEncrypted } from "@/lib/utils/encryption";

describe("encryptBudgetAmounts", () => {
  it("should encrypt both startAmount and currentAmount when both are numeric", async () => {
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

    const result = await encryptBudgetAmounts(budget);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const encryptedBudget = result.value;
      expect(encryptedBudget.startAmount).not.toBe("10000.00");
      expect(encryptedBudget.currentAmount).not.toBe("8500.00");
      expect(encryptedBudget.sa_iv).toBeTruthy();
      expect(encryptedBudget.sa_tag).toBeTruthy();
      expect(encryptedBudget.ca_iv).toBeTruthy();
      expect(encryptedBudget.ca_tag).toBeTruthy();
      expect(
        isEncrypted(
          encryptedBudget.startAmount,
          encryptedBudget.sa_iv,
          encryptedBudget.sa_tag,
        ),
      ).toBe(true);
      expect(
        isEncrypted(
          encryptedBudget.currentAmount,
          encryptedBudget.ca_iv,
          encryptedBudget.ca_tag,
        ),
      ).toBe(true);
    }
  });

  it("should not encrypt already encrypted amounts", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "encrypted_start_value",
      currentAmount: "encrypted_current_value",
      sa_iv: "some_sa_iv_value",
      sa_tag: "some_sa_tag_value",
      ca_iv: "some_ca_iv_value",
      ca_tag: "some_ca_tag_value",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await encryptBudgetAmounts(budget);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const encryptedBudget = result.value;
      expect(encryptedBudget.startAmount).toBe("encrypted_start_value");
      expect(encryptedBudget.currentAmount).toBe("encrypted_current_value");
      expect(encryptedBudget.sa_iv).toBe("some_sa_iv_value");
      expect(encryptedBudget.sa_tag).toBe("some_sa_tag_value");
      expect(encryptedBudget.ca_iv).toBe("some_ca_iv_value");
      expect(encryptedBudget.ca_tag).toBe("some_ca_tag_value");
    }
  });

  it("should encrypt only currentAmount when startAmount is not numeric", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "encrypted_start",
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

    const result = await encryptBudgetAmounts(budget);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const encryptedBudget = result.value;
      expect(encryptedBudget.startAmount).toBe("encrypted_start");
      expect(encryptedBudget.currentAmount).not.toBe("8500.00");
      expect(encryptedBudget.ca_iv).toBeTruthy();
      expect(encryptedBudget.ca_tag).toBeTruthy();
    }
  });

  it("should encrypt only startAmount when currentAmount is not numeric", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "10000.00",
      currentAmount: "encrypted_current",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await encryptBudgetAmounts(budget);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const encryptedBudget = result.value;
      expect(encryptedBudget.startAmount).not.toBe("10000.00");
      expect(encryptedBudget.currentAmount).toBe("encrypted_current");
      expect(encryptedBudget.ca_iv).toBeTruthy();
      expect(encryptedBudget.ca_tag).toBeTruthy();
    }
  });

  it("should handle zero values as numeric and encrypt them", async () => {
    const budget: Budget = {
      id: "b1234567-89ab-cdef-0123-456789abcdef",
      userId: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Monthly Budget",
      startAmount: "0",
      currentAmount: "0.00",
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await encryptBudgetAmounts(budget);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const encryptedBudget = result.value;
      expect(encryptedBudget.startAmount).not.toBe("0");
      expect(encryptedBudget.currentAmount).not.toBe("0.00");
      expect(encryptedBudget.ca_iv).toBeTruthy();
      expect(encryptedBudget.ca_tag).toBeTruthy();
    }
  });

  it("should handle negative numeric values and encrypt them", async () => {
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

    const result = await encryptBudgetAmounts(budget);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const encryptedBudget = result.value;
      expect(encryptedBudget.startAmount).not.toBe("10000.00");
      expect(encryptedBudget.currentAmount).not.toBe("-50.00");
      expect(encryptedBudget.ca_iv).toBeTruthy();
      expect(encryptedBudget.ca_tag).toBeTruthy();
    }
  });
});

describe("subtractFromBudgetCurrentAmount with encrypted values", () => {
  it("should decrypt, subtract, and return unencrypted budget", async () => {
    // First encrypt a budget
    const originalBudget: Budget = {
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

    const encryptResult = await encryptBudgetAmounts(originalBudget);
    expect(encryptResult.isOk()).toBe(true);

    if (encryptResult.isOk()) {
      const encryptedBudget = encryptResult.value;

      // Now subtract from the encrypted budget
      const result = await subtractFromBudgetCurrentAmount(
        encryptedBudget,
        150.5,
      );

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const updatedBudget = result.value;
        expect(updatedBudget.currentAmount).toBe("8349.5");
        expect(
          isEncrypted(
            updatedBudget.currentAmount,
            updatedBudget.ca_iv,
            updatedBudget.ca_tag,
          ),
        ).toBe(false);
      }
    }
  });
});

describe("addToBudgetCurrentAmount with encrypted values", () => {
  it("should decrypt, add, and return unencrypted budget", async () => {
    // First encrypt a budget
    const originalBudget: Budget = {
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

    const encryptResult = await encryptBudgetAmounts(originalBudget);
    expect(encryptResult.isOk()).toBe(true);

    if (encryptResult.isOk()) {
      const encryptedBudget = encryptResult.value;

      // Now add to the encrypted budget
      const result = await addToBudgetCurrentAmount(encryptedBudget, 150.5);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const updatedBudget = result.value;
        expect(updatedBudget.currentAmount).toBe("8650.5");
        expect(
          isEncrypted(
            updatedBudget.currentAmount,
            updatedBudget.ca_iv,
            updatedBudget.ca_tag,
          ),
        ).toBe(false);
      }
    }
  });
});
