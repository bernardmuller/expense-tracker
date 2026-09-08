import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt, isEncrypted } from "./encryption";

describe("encryption", () => {
  describe("encrypt()", () => {
    it("should successfully encrypt a string value", async () => {
      const plaintext = "test-value";
      const result = await encrypt(plaintext);

      if (result.isErr()) {
        console.log("Encryption error:", result.error);
      }

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveProperty("ciphertext");
        expect(result.value).toHaveProperty("iv");
        expect(result.value).toHaveProperty("tag");
      }
    });

    it("should return ciphertext, iv, and tag as base64url strings", async () => {
      const plaintext = "test-value";
      const result = await encrypt(plaintext);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const base64urlRegex = /^[A-Za-z0-9_-]+$/;
        expect(result.value.ciphertext).toMatch(base64urlRegex);
        expect(result.value.iv).toMatch(base64urlRegex);
        expect(result.value.tag).toMatch(base64urlRegex);
      }
    });

    it("should return different ciphertext for same input due to random IV", async () => {
      const plaintext = "same-value";
      const result1 = await encrypt(plaintext);
      const result2 = await encrypt(plaintext);

      expect(result1.isOk()).toBe(true);
      expect(result2.isOk()).toBe(true);

      if (result1.isOk() && result2.isOk()) {
        expect(result1.value.ciphertext).not.toBe(result2.value.ciphertext);
        expect(result1.value.iv).not.toBe(result2.value.iv);
      }
    });

    it("should handle empty string", async () => {
      const plaintext = "";
      const result = await encrypt(plaintext);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveProperty("ciphertext");
        expect(result.value.iv).toBeTruthy();
        expect(result.value.tag).toBeTruthy();
      }
    });

    it("should handle special characters and unicode", async () => {
      const plaintext = "Hello 世界! 🔒 @#$%^&*()";
      const result = await encrypt(plaintext);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.ciphertext).toBeTruthy();
      }
    });

    it("should handle long strings", async () => {
      const plaintext = "a".repeat(10000);
      const result = await encrypt(plaintext);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.ciphertext).toBeTruthy();
      }
    });

    it("should handle numeric strings", async () => {
      const plaintext = "1500.50";
      const result = await encrypt(plaintext);

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.ciphertext).toBeTruthy();
      }
    });
  });

  describe("decrypt()", () => {
    it("should successfully decrypt a previously encrypted value", async () => {
      const plaintext = "test-value";
      const encryptResult = await encrypt(plaintext);

      expect(encryptResult.isOk()).toBe(true);
      if (encryptResult.isOk()) {
        const { ciphertext, iv, tag } = encryptResult.value;
        const decryptResult = await decrypt(ciphertext, iv, tag);

        expect(decryptResult.isOk()).toBe(true);
        if (decryptResult.isOk()) {
          expect(decryptResult.value).toBe(plaintext);
        }
      }
    });

    it("should return original plaintext after encrypt/decrypt cycle", async () => {
      const testCases = [
        "simple-text",
        "1500.50",
        "999999.99",
        "",
        "Hello 世界! 🔒",
        "special@#$%chars",
      ];

      for (const plaintext of testCases) {
        const encryptResult = await encrypt(plaintext);
        expect(encryptResult.isOk()).toBe(true);

        if (encryptResult.isOk()) {
          const { ciphertext, iv, tag } = encryptResult.value;
          const decryptResult = await decrypt(ciphertext, iv, tag);

          expect(decryptResult.isOk()).toBe(true);
          if (decryptResult.isOk()) {
            expect(decryptResult.value).toBe(plaintext);
          }
        }
      }
    });

    it("should fail with invalid auth tag", async () => {
      const plaintext = "test-value";
      const encryptResult = await encrypt(plaintext);

      expect(encryptResult.isOk()).toBe(true);
      if (encryptResult.isOk()) {
        const { ciphertext, iv } = encryptResult.value;
        const invalidTag = "invalid_tag_value";
        const decryptResult = await decrypt(ciphertext, iv, invalidTag);

        expect(decryptResult.isErr()).toBe(true);
      }
    });

    it("should fail with invalid IV", async () => {
      const plaintext = "test-value";
      const encryptResult = await encrypt(plaintext);

      expect(encryptResult.isOk()).toBe(true);
      if (encryptResult.isOk()) {
        const { ciphertext, tag } = encryptResult.value;
        const invalidIv = "invalid_iv";
        const decryptResult = await decrypt(ciphertext, invalidIv, tag);

        expect(decryptResult.isErr()).toBe(true);
      }
    });

    it("should fail with tampered ciphertext", async () => {
      const plaintext = "test-value";
      const encryptResult = await encrypt(plaintext);

      expect(encryptResult.isOk()).toBe(true);
      if (encryptResult.isOk()) {
        const { ciphertext, iv, tag } = encryptResult.value;
        const tamperedCiphertext = ciphertext + "tampered";
        const decryptResult = await decrypt(tamperedCiphertext, iv, tag);

        expect(decryptResult.isErr()).toBe(true);
      }
    });

    it("should handle empty string round-trip", async () => {
      const plaintext = "";
      const encryptResult = await encrypt(plaintext);

      expect(encryptResult.isOk()).toBe(true);
      if (encryptResult.isOk()) {
        const { ciphertext, iv, tag } = encryptResult.value;
        const decryptResult = await decrypt(ciphertext, iv, tag);

        expect(decryptResult.isOk()).toBe(true);
        if (decryptResult.isOk()) {
          expect(decryptResult.value).toBe("");
        }
      }
    });
  });

  describe("isEncrypted()", () => {
    it("should return true when iv and tag are present and value is not numeric", () => {
      const result = isEncrypted("encrypted_base64_string", "some_iv", "some_tag");
      expect(result).toBe(true);
    });

    it("should return false when iv is null", () => {
      const result = isEncrypted("encrypted_base64_string", null, "some_tag");
      expect(result).toBe(false);
    });

    it("should return false when tag is null", () => {
      const result = isEncrypted("encrypted_base64_string", "some_iv", null);
      expect(result).toBe(false);
    });

    it("should return false when both iv and tag are null", () => {
      const result = isEncrypted("encrypted_base64_string", null, null);
      expect(result).toBe(false);
    });

    it("should return false for plain numeric strings", () => {
      const testCases = ["1500.50", "1500", "0", "0.0", "123.456", "999999.99"];

      for (const numericString of testCases) {
        const result = isEncrypted(numericString, "some_iv", "some_tag");
        expect(result).toBe(false);
      }
    });

    it("should return false for integer strings", () => {
      const result = isEncrypted("42", "some_iv", "some_tag");
      expect(result).toBe(false);
    });

    it("should return true for non-numeric strings with iv and tag", () => {
      const testCases = [
        "abc123",
        "encrypted-data",
        "base64_encoded_string",
        "123abc",
        "abc.123",
      ];

      for (const nonNumericString of testCases) {
        const result = isEncrypted(nonNumericString, "some_iv", "some_tag");
        expect(result).toBe(true);
      }
    });

    it("should return false for scientific notation", () => {
      const result = isEncrypted("1.5e3", "some_iv", "some_tag");
      expect(result).toBe(false);
    });
  });

  describe("Round-trip integration tests", () => {
    it("should handle multiple encrypt/decrypt cycles", async () => {
      let value = "initial-value";

      for (let i = 0; i < 5; i++) {
        const encryptResult = await encrypt(value);
        expect(encryptResult.isOk()).toBe(true);

        if (encryptResult.isOk()) {
          const { ciphertext, iv, tag } = encryptResult.value;
          const decryptResult = await decrypt(ciphertext, iv, tag);

          expect(decryptResult.isOk()).toBe(true);
          if (decryptResult.isOk()) {
            expect(decryptResult.value).toBe(value);
            value = decryptResult.value + "-cycle" + i;
          }
        }
      }
    });

    it("should handle different values encrypted separately", async () => {
      const values = ["value1", "value2", "value3"];
      const encrypted = [];

      for (const value of values) {
        const encryptResult = await encrypt(value);
        expect(encryptResult.isOk()).toBe(true);
        if (encryptResult.isOk()) {
          encrypted.push({ original: value, ...encryptResult.value });
        }
      }

      for (const item of encrypted) {
        const decryptResult = await decrypt(item.ciphertext, item.iv, item.tag);
        expect(decryptResult.isOk()).toBe(true);
        if (decryptResult.isOk()) {
          expect(decryptResult.value).toBe(item.original);
        }
      }
    });

    it("should handle real-world budget amounts", async () => {
      const budgetAmounts = [
        "1500.50",
        "999999.99",
        "0.01",
        "10000.00",
        "42.42",
      ];

      for (const amount of budgetAmounts) {
        const encryptResult = await encrypt(amount);
        expect(encryptResult.isOk()).toBe(true);

        if (encryptResult.isOk()) {
          const { ciphertext, iv, tag } = encryptResult.value;
          const decryptResult = await decrypt(ciphertext, iv, tag);

          expect(decryptResult.isOk()).toBe(true);
          if (decryptResult.isOk()) {
            expect(decryptResult.value).toBe(amount);
            expect(parseFloat(decryptResult.value)).toBe(parseFloat(amount));
          }
        }
      }
    });
  });

  describe("Error handling", () => {
    it("should return Result type from encrypt", async () => {
      const result = await encrypt("test");
      expect(result).toHaveProperty("isOk");
      expect(result).toHaveProperty("isErr");
    });

    it("should return Result type from decrypt", async () => {
      const result = await decrypt("invalid", "invalid", "invalid");
      expect(result).toHaveProperty("isOk");
      expect(result).toHaveProperty("isErr");
    });

    it("should return error Result on decryption failure", async () => {
      const result = await decrypt(
        "totally_invalid_ciphertext",
        "invalid_iv",
        "invalid_tag",
      );

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe("Backward compatibility with isEncrypted", () => {
    it("should detect unencrypted numeric values correctly", () => {
      expect(isEncrypted("1500.50", null, null)).toBe(false);
      expect(isEncrypted("1500.50", null, "tag")).toBe(false);
      expect(isEncrypted("1500.50", "iv", null)).toBe(false);
    });

    it("should detect encrypted values correctly", async () => {
      const plaintext = "1500.50";
      const encryptResult = await encrypt(plaintext);

      expect(encryptResult.isOk()).toBe(true);
      if (encryptResult.isOk()) {
        const { ciphertext, iv, tag } = encryptResult.value;
        expect(isEncrypted(ciphertext, iv, tag)).toBe(true);
      }
    });

    it("should handle migration scenario", async () => {
      const unencryptedValue = "1500.50";
      expect(isEncrypted(unencryptedValue, null, null)).toBe(false);

      const encryptResult = await encrypt(unencryptedValue);
      expect(encryptResult.isOk()).toBe(true);

      if (encryptResult.isOk()) {
        const { ciphertext, iv, tag } = encryptResult.value;
        expect(isEncrypted(ciphertext, iv, tag)).toBe(true);

        const decryptResult = await decrypt(ciphertext, iv, tag);
        expect(decryptResult.isOk()).toBe(true);

        if (decryptResult.isOk()) {
          expect(decryptResult.value).toBe(unencryptedValue);
        }
      }
    });
  });
});
