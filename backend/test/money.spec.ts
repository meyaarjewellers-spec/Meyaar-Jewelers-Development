import { describe, it, expect } from "vitest";
import { toCents, centsToDecimalString, centsToMajor } from "../services/money";

describe("money", () => {
  describe("toCents", () => {
    it("parses decimal strings from the DB", () => {
      expect(toCents("189.00")).toBe(18900);
      expect(toCents("0.01")).toBe(1);
      expect(toCents("12.34")).toBe(1234);
    });
    it("handles numbers and rounds correctly (no float drift)", () => {
      expect(toCents(0.1 + 0.2)).toBe(30); // 0.30000000000000004 → 30
      expect(toCents(99.995)).toBe(10000);
    });
    it("treats null/empty/undefined as 0", () => {
      expect(toCents(null)).toBe(0);
      expect(toCents(undefined)).toBe(0);
      expect(toCents("")).toBe(0);
    });
    it("ignores non-finite values", () => {
      expect(toCents(Number.NaN)).toBe(0);
      expect(toCents(Number.POSITIVE_INFINITY)).toBe(0);
    });
  });

  describe("centsToDecimalString", () => {
    it("formats cents as a 2dp string for numeric columns", () => {
      expect(centsToDecimalString(18900)).toBe("189.00");
      expect(centsToDecimalString(1)).toBe("0.01");
      expect(centsToDecimalString(0)).toBe("0.00");
    });
  });

  describe("centsToMajor", () => {
    it("converts cents to a major-unit number", () => {
      expect(centsToMajor(18900)).toBe(189);
      expect(centsToMajor(1)).toBe(0.01);
    });
  });

  it("round-trips cents → string → cents", () => {
    for (const cents of [0, 1, 99, 18900, 1234567]) {
      expect(toCents(centsToDecimalString(cents))).toBe(cents);
    }
  });
});
