import { describe, expect, it } from "vitest";
import { computeStreak } from "./actions/computeStreak";

const TODAY = "2026-07-03";

describe("computeStreak", () => {
  it("returns zeros for no activity", () => {
    const result = computeStreak([], TODAY);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({
        days: [],
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        checkedInToday: false,
      });
    }
  });

  it("counts a single check-in today as a streak of one", () => {
    const result = computeStreak([{ date: TODAY, count: 1 }], TODAY);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentStreak).toBe(1);
      expect(result.value.longestStreak).toBe(1);
      expect(result.value.totalActiveDays).toBe(1);
      expect(result.value.checkedInToday).toBe(true);
    }
  });

  it("counts consecutive days ending today", () => {
    const result = computeStreak(
      [
        { date: "2026-07-01", count: 2 },
        { date: "2026-07-02", count: 1 },
        { date: "2026-07-03", count: 5 },
      ],
      TODAY,
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentStreak).toBe(3);
      expect(result.value.longestStreak).toBe(3);
      expect(result.value.totalActiveDays).toBe(3);
    }
  });

  it("keeps the streak alive when today is missing but yesterday is present", () => {
    const result = computeStreak(
      [
        { date: "2026-07-01", count: 1 },
        { date: "2026-07-02", count: 1 },
      ],
      TODAY,
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.checkedInToday).toBe(false);
      expect(result.value.currentStreak).toBe(2);
    }
  });

  it("breaks the current streak when there is a gap of two or more days", () => {
    const result = computeStreak(
      [
        { date: "2026-06-28", count: 1 },
        { date: "2026-06-29", count: 1 },
        { date: "2026-06-30", count: 1 },
      ],
      TODAY,
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      // Last activity was 2026-06-30; today is 2026-07-03 → streak is dead.
      expect(result.value.currentStreak).toBe(0);
      expect(result.value.longestStreak).toBe(3);
    }
  });

  it("reports longest streak independently of the current one", () => {
    const result = computeStreak(
      [
        // 4-day run in the past
        { date: "2026-06-01", count: 1 },
        { date: "2026-06-02", count: 1 },
        { date: "2026-06-03", count: 1 },
        { date: "2026-06-04", count: 1 },
        // current 1-day run
        { date: "2026-07-03", count: 1 },
      ],
      TODAY,
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentStreak).toBe(1);
      expect(result.value.longestStreak).toBe(4);
      expect(result.value.totalActiveDays).toBe(5);
    }
  });

  it("collapses duplicate dates and sorts the day series", () => {
    const result = computeStreak(
      [
        { date: "2026-07-02", count: 1 },
        { date: "2026-07-01", count: 1 },
        { date: "2026-07-02", count: 3 },
      ],
      TODAY,
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.days).toEqual([
        { date: "2026-07-01", count: 1 },
        { date: "2026-07-02", count: 4 },
      ]);
      expect(result.value.totalActiveDays).toBe(2);
    }
  });
});
