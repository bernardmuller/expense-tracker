import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/lib/db/testUtils";
import * as UserOperations from "./operations";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { budgets, categories } from "@/lib/db/schema";

describe("User Operations - Budget Dates", () => {
    test("onboardUser should create preferences and budget with dates", async () => {
        await withTestTransaction(async (ctx) => {
            // 1. Create User
            const uniqueId = Math.random().toString(36).substring(7);
            const createResult = await UserOperations.createUser(
                { name: "Date Tester", email: `dates-${uniqueId}@test.com` },
                ctx,
            );
            if (createResult.isErr()) {
                console.error("Create User Error:", createResult.error);
            }
            expect(createResult.isOk()).toBe(true);
            const userId = createResult._unsafeUnwrap().id;

            // 2. Create Category
            const categoryId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
            await ctx.db.insert(categories).values({
                id: categoryId,
                key: "food",
                label: "Food",
                icon: "🍔",
            });

            // 3. Onboard User with Dates
            const startDate = new Date("2024-01-01");
            const endDate = new Date("2024-01-31");

            const onboardResult = await UserOperations.onboardUser(
                userId,
                {
                    name: "January Budget",
                    startAmount: 5000,
                    startDate,
                    endDate,
                    budgetFrequency: "monthly",
                    budgetStartDay: 1,
                    categories: [
                        {
                            id: categoryId,
                            icon: "🍔",
                            label: "Food",
                            amount: 2000
                        }
                    ],
                },
                ctx,
            );

            if (onboardResult.isErr()) {
                console.error("Onboard User Error:", onboardResult.error);
            }
            expect(onboardResult.isOk()).toBe(true);

            // 3. Verify User Preferences
            const [pref] = await ctx.db
                .select()
                .from(userPreferences)
                .where(eq(userPreferences.userId, userId));

            expect(pref).toBeDefined();
            expect(pref.budgetStartDate).toEqual(startDate);
            expect(pref.frequency).toBe("monthly");
            expect(pref.budgetStartDay).toBe(1);

            // 4. Verify Budget Dates
            const [budget] = await ctx.db
                .select()
                .from(budgets)
                .where(eq(budgets.userId, userId));

            expect(budget).toBeDefined();
            expect(budget.startDate).toEqual(startDate);
            expect(budget.endDate).toEqual(endDate);
        });
    });
});
