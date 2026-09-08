import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/lib/db/testUtils";
import * as StreakOperations from "./services";
import { todayString, addDays } from "./dateUtils";
import { generateMockUser } from "@/test/mocks/user.mock";
import { generateUuid } from "@/lib/utils/generateUuid";
import type { AppContext } from "@/lib/db/context";
import { users, userActivity } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const createTestUser = async (ctx: AppContext) => {
  const mockUser = generateMockUser();
  const [createdUser] = await ctx.db.insert(users).values(mockUser).returning();

  if (!createdUser) {
    throw new Error("Failed to create test user");
  }

  return createdUser;
};

describe("Streak Operations", () => {
  describe("checkIn", () => {
    test("records today's activity and returns a streak of one", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const today = todayString();

        const result = await StreakOperations.checkIn(user.id, ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.currentStreak).toBe(1);
          expect(result.value.checkedInToday).toBe(true);
          expect(result.value.totalActiveDays).toBe(1);
        }

        const [row] = await ctx.db
          .select()
          .from(userActivity)
          .where(
            and(
              eq(userActivity.userId, user.id),
              eq(userActivity.date, today),
            ),
          );
        expect(row?.count).toBe(1);
      });
    });

    test("increments the day's count on repeat check-ins without inflating the streak", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const today = todayString();

        await StreakOperations.checkIn(user.id, ctx);
        const result = await StreakOperations.checkIn(user.id, ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          // Two opens same day → streak stays 1, but the day's intensity is 2.
          expect(result.value.currentStreak).toBe(1);
          expect(result.value.totalActiveDays).toBe(1);
          const todayEntry = result.value.days.find((d) => d.date === today);
          expect(todayEntry?.count).toBe(2);
        }
      });
    });
  });

  describe("getStreak", () => {
    test("computes a multi-day streak from seeded activity", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const today = todayString();
        const dayStr = (offset: number) => addDays(today, -offset);

        await ctx.db.insert(userActivity).values([
          { id: generateUuid(), userId: user.id, date: dayStr(0), count: 1 },
          { id: generateUuid(), userId: user.id, date: dayStr(1), count: 3 },
          { id: generateUuid(), userId: user.id, date: dayStr(2), count: 1 },
        ]);

        const result = await StreakOperations.getStreak(user.id, 365, ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.currentStreak).toBe(3);
          expect(result.value.longestStreak).toBe(3);
          expect(result.value.totalActiveDays).toBe(3);
          expect(result.value.checkedInToday).toBe(true);
        }
      });
    });

    test("returns an empty streak for a user with no activity", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);

        const result = await StreakOperations.getStreak(user.id, 365, ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.currentStreak).toBe(0);
          expect(result.value.days).toEqual([]);
        }
      });
    });
  });
});
