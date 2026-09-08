import { describe, it, expect } from "vitest";
import { generateOTP } from "./generateOTP";

describe("generateOTP", () => {
  it("should return a number", async () => {
    const otp = generateOTP();
    expect(typeof otp).toBe("number");
  });

  it("should generate a number between 0 and 999999", () => {
    const otp = generateOTP();
    expect(otp).toBeGreaterThanOrEqual(0);
    expect(otp).toBeLessThanOrEqual(999999);
  });

  it("should generate a 6-digit number when padded with leading zeros", () => {
    const otp = generateOTP();
    const paddedOTP = String(otp).padStart(6, "0");
    expect(paddedOTP).toHaveLength(6);
  });

  it("should generate valid OTPs consistently over multiple calls", () => {
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      const otp = generateOTP();
      expect(otp).toBeGreaterThanOrEqual(0);
      expect(otp).toBeLessThanOrEqual(999999);
      expect(typeof otp).toBe("number");

      const paddedOTP = String(otp).padStart(6, "0");
      expect(paddedOTP).toHaveLength(6);
      expect(paddedOTP).toMatch(/^\d{6}$/);
    }
  });

  it("should generate only numeric values", () => {
    const otp = generateOTP();
    expect(Number.isInteger(otp)).toBe(true);
    expect(Number.isNaN(otp)).toBe(false);
  });

  it("should pad small numbers correctly", () => {
    const smallNumbers = [0, 1, 10, 100, 1000, 10000];
    const expectedPadded = [
      "000000",
      "000001",
      "000010",
      "000100",
      "001000",
      "010000",
    ];

    smallNumbers.forEach((num, index) => {
      const padded = String(num).padStart(6, "0");
      expect(padded).toBe(expectedPadded[index]);
      expect(padded).toHaveLength(6);
    });
  });
});
