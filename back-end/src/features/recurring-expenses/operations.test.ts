import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/lib/db/testUtils";
import * as RecurringOperations from "./services";
import { generateMockCategory } from "@/test/mocks/category.mock";
import { generateMockUser } from "@/test/mocks/user.mock";
import type { AppContext } from "@/lib/db/context";
import {
  categories,
  users,
  budgets,
  expenses,
  recurringExpenseTemplates,
  budgetRecurringExpenses,
} from "@/lib/db/schema";
import { generateUuid } from "@/lib/utils/generateUuid";
import { eq } from "drizzle-orm";
import { createNewBudget } from "@/features/users/queries/createNewBudget";
import { decryptBudgetAmounts } from "@/features/budgets/domain/budget-processing.domain";
import {
  InstanceAlreadyPaidError,
  InstanceNotPaidError,
  InstancePaidCannotDeleteError,
} from "./types/errors";
import { NotFoundError, ValidationError } from "@/lib/errors/domain";

const createTestCategory = async (ctx: AppContext) => {
  const mock = generateMockCategory({ key: `cat-${generateUuid()}` });
  const [row] = await ctx.db.insert(categories).values(mock).returning();
  if (!row) throw new Error("Failed to create test category");
  return row;
};

const createTestUser = async (ctx: AppContext) => {
  const mock = generateMockUser();
  const [row] = await ctx.db.insert(users).values(mock).returning();
  if (!row) throw new Error("Failed to create test user");
  return row;
};

const createTestBudget = async (
  ctx: AppContext,
  userId: string,
  startAmount = "10000.00",
  currentAmount = "10000.00",
) => {
  const [row] = await ctx.db
    .insert(budgets)
    .values({
      id: generateUuid(),
      userId,
      name: "Test Budget",
      startAmount,
      currentAmount,
      isActive: true,
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
    .returning();
  if (!row) throw new Error("Failed to create test budget");
  return row;
};

describe("Recurring Expense Operations", () => {
  describe("createTemplate", () => {
    test("creates a template with snapshot fields", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);

        const result = await RecurringOperations.createTemplate(
          user.id,
          {
            description: "Netflix",
            amount: 159.99,
            categoryId: category.id,
          },
          ctx,
        );

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.description).toBe("Netflix");
          expect(result.value.amount).toBe("159.99");
          expect(result.value.categoryId).toBe(category.id);
          expect(result.value.userId).toBe(user.id);
          expect(result.value.deletedAt).toBeNull();
        }
      });
    });

    test("fails when user does not exist", async () => {
      await withTestTransaction(async (ctx) => {
        const category = await createTestCategory(ctx);
        const result = await RecurringOperations.createTemplate(
          "00000000-0000-0000-0000-000000000000",
          { description: "X", amount: 10, categoryId: category.id },
          ctx,
        );
        expect(result.isErr()).toBe(true);
      });
    });

    test("fails when category does not exist", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const result = await RecurringOperations.createTemplate(
          user.id,
          {
            description: "X",
            amount: 10,
            categoryId: "00000000-0000-0000-0000-000000000000",
          },
          ctx,
        );
        expect(result.isErr()).toBe(true);
      });
    });
  });

  describe("updateTemplate", () => {
    test("updates amount only and leaves other fields intact", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const createRes = await RecurringOperations.createTemplate(
          user.id,
          { description: "Netflix", amount: 159.99, categoryId: category.id },
          ctx,
        );
        const template = createRes._unsafeUnwrap();

        const updateRes = await RecurringOperations.updateTemplate(
          user.id,
          template.id,
          { amount: 179.99 },
          ctx,
        );

        expect(updateRes.isOk()).toBe(true);
        if (updateRes.isOk()) {
          expect(updateRes.value.amount).toBe("179.99");
          expect(updateRes.value.description).toBe("Netflix");
          expect(updateRes.value.categoryId).toBe(category.id);
        }
      });
    });

    test("returns NotFound when user does not own template", async () => {
      await withTestTransaction(async (ctx) => {
        const owner = await createTestUser(ctx);
        const otherUser = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const created = (
          await RecurringOperations.createTemplate(
            owner.id,
            { description: "X", amount: 10, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const result = await RecurringOperations.updateTemplate(
          otherUser.id,
          created.id,
          { amount: 20 },
          ctx,
        );

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(NotFoundError);
        }
      });
    });
  });

  describe("softDeleteTemplate", () => {
    test("sets deletedAt; template stops appearing in active list", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const created = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Gym", amount: 500, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const deleted = await RecurringOperations.softDeleteTemplate(
          user.id,
          created.id,
          ctx,
        );
        expect(deleted.isOk()).toBe(true);

        const active = (
          await RecurringOperations.getTemplatesByUserId(user.id, ctx)
        )._unsafeUnwrap();
        expect(active.find((t) => t.id === created.id)).toBeUndefined();

        const all = (
          await RecurringOperations.getTemplatesByUserId(user.id, ctx, {
            includeDeleted: true,
          })
        )._unsafeUnwrap();
        expect(all.find((t) => t.id === created.id)?.deletedAt).toBeTruthy();
      });
    });

    test("returns NotFound when user does not own template", async () => {
      await withTestTransaction(async (ctx) => {
        const owner = await createTestUser(ctx);
        const otherUser = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const created = (
          await RecurringOperations.createTemplate(
            owner.id,
            { description: "X", amount: 10, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const result = await RecurringOperations.softDeleteTemplate(
          otherUser.id,
          created.id,
          ctx,
        );

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(NotFoundError);
        }
      });
    });
  });

  describe("budget creation with recurringExpenseTemplateIds", () => {
    test("snapshots template into budget_recurring_expenses", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();

        const instances = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        expect(instances).toHaveLength(1);
        expect(instances[0]!.description).toBe("Netflix");
        expect(instances[0]!.amount).toBe("159.99");
        expect(instances[0]!.categoryId).toBe(category.id);
        expect(instances[0]!.isPaid).toBe(false);
      });
    });

    test("rolls back the entire budget when a templateId is invalid", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);

        const result = await createNewBudget(
          user.id,
          {
            name: "April",
            startAmount: 5000,
            categories: [
              { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
            ],
            recurringExpenseTemplateIds: [
              "00000000-0000-0000-0000-000000000000",
            ],
          },
          ctx,
        );

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(ValidationError);
        }

        const allBudgets = await ctx.db
          .select()
          .from(budgets)
          .where(eq(budgets.userId, user.id));
        expect(allBudgets).toHaveLength(0);
      });
    });

    test("rolls back when templateId belongs to another user", async () => {
      await withTestTransaction(async (ctx) => {
        const owner = await createTestUser(ctx);
        const stranger = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const ownerTemplate = (
          await RecurringOperations.createTemplate(
            owner.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const result = await createNewBudget(
          stranger.id,
          {
            name: "April",
            startAmount: 5000,
            categories: [
              { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
            ],
            recurringExpenseTemplateIds: [ownerTemplate.id],
          },
          ctx,
        );

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(ValidationError);
        }
      });
    });
  });

  describe("markInstancePaid", () => {
    test("creates expense, deducts budget, flips instance — atomic", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();

        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        const result = await RecurringOperations.markInstancePaid(
          user.id,
          budget.id,
          instance!.id,
          {
            description: "Netflix",
            amount: 165,
            categoryId: category.id,
          },
          ctx,
        );

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.amount).toBe("165.00");
        }

        const [updatedInstance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.id, instance!.id));
        expect(updatedInstance!.isPaid).toBe(true);
        expect(updatedInstance!.expenseId).toBeTruthy();

        const [updatedBudget] = await ctx.db
          .select()
          .from(budgets)
          .where(eq(budgets.id, budget.id));
        const decrypted = await decryptBudgetAmounts(updatedBudget!);
        expect(decrypted.isOk()).toBe(true);
        if (decrypted.isOk()) {
          expect(parseFloat(decrypted.value.currentAmount)).toBeCloseTo(
            5000 - 165,
            2,
          );
        }
      });
    });

    test("returns 409-like InstanceAlreadyPaidError when already paid", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();

        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        const first = await RecurringOperations.markInstancePaid(
          user.id,
          budget.id,
          instance!.id,
          { description: "Netflix", amount: 159.99, categoryId: category.id },
          ctx,
        );
        expect(first.isOk()).toBe(true);

        const second = await RecurringOperations.markInstancePaid(
          user.id,
          budget.id,
          instance!.id,
          { description: "Netflix", amount: 159.99, categoryId: category.id },
          ctx,
        );
        expect(second.isErr()).toBe(true);
        if (second.isErr()) {
          expect(second.error).toBeInstanceOf(InstanceAlreadyPaidError);
        }
      });
    });

    test("rejects when budget belongs to another user", async () => {
      await withTestTransaction(async (ctx) => {
        const owner = await createTestUser(ctx);
        const stranger = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            owner.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();
        const budget = (
          await createNewBudget(
            owner.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();
        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        const result = await RecurringOperations.markInstancePaid(
          stranger.id,
          budget.id,
          instance!.id,
          { description: "X", amount: 1, categoryId: category.id },
          ctx,
        );

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(NotFoundError);
        }
      });
    });
  });

  describe("markInstanceUnpaid", () => {
    test("soft-deletes expense, restores budget, flips instance", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();
        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();
        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        const paid = (
          await RecurringOperations.markInstancePaid(
            user.id,
            budget.id,
            instance!.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();

        const unpaidRes = await RecurringOperations.markInstanceUnpaid(
          user.id,
          budget.id,
          instance!.id,
          ctx,
        );
        expect(unpaidRes.isOk()).toBe(true);

        const [updatedInstance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.id, instance!.id));
        expect(updatedInstance!.isPaid).toBe(false);
        expect(updatedInstance!.expenseId).toBeNull();

        const [softDeletedExpense] = await ctx.db
          .select()
          .from(expenses)
          .where(eq(expenses.id, paid.id));
        expect(softDeletedExpense!.deletedAt).toBeTruthy();

        const [updatedBudget] = await ctx.db
          .select()
          .from(budgets)
          .where(eq(budgets.id, budget.id));
        const decrypted = await decryptBudgetAmounts(updatedBudget!);
        expect(decrypted.isOk()).toBe(true);
        if (decrypted.isOk()) {
          expect(parseFloat(decrypted.value.currentAmount)).toBeCloseTo(
            5000,
            2,
          );
        }
      });
    });

    test("returns InstanceNotPaidError when not paid", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();
        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();
        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        const result = await RecurringOperations.markInstanceUnpaid(
          user.id,
          budget.id,
          instance!.id,
          ctx,
        );

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(InstanceNotPaidError);
        }
      });
    });
  });

  describe("deleteUnpaidInstance", () => {
    test("soft-deletes an unpaid instance", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Gym", amount: 500, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();
        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🏥", label: "Health", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();
        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        const result = await RecurringOperations.deleteUnpaidInstance(
          user.id,
          budget.id,
          instance!.id,
          ctx,
        );
        expect(result.isOk()).toBe(true);

        const [stillThere] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.id, instance!.id));
        expect(stillThere!.deletedAt).toBeTruthy();
      });
    });

    test("rejects deletion when instance is paid", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();
        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();
        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        await RecurringOperations.markInstancePaid(
          user.id,
          budget.id,
          instance!.id,
          { description: "Netflix", amount: 159.99, categoryId: category.id },
          ctx,
        );

        const result = await RecurringOperations.deleteUnpaidInstance(
          user.id,
          budget.id,
          instance!.id,
          ctx,
        );

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBeInstanceOf(InstancePaidCannotDeleteError);
        }
      });
    });
  });

  describe("snapshot independence", () => {
    test("template edit does not mutate existing instances", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();
        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();

        await RecurringOperations.updateTemplate(
          user.id,
          template.id,
          { amount: 179.99, description: "Netflix Premium" },
          ctx,
        );

        const [instance] = await ctx.db
          .select()
          .from(budgetRecurringExpenses)
          .where(eq(budgetRecurringExpenses.budgetId, budget.id));

        expect(instance!.amount).toBe("159.99");
        expect(instance!.description).toBe("Netflix");
      });
    });
  });

  describe("getInstancesByBudgetId", () => {
    test("returns instances with category + expense relations populated", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const template = (
          await RecurringOperations.createTemplate(
            user.id,
            { description: "Netflix", amount: 159.99, categoryId: category.id },
            ctx,
          )
        )._unsafeUnwrap();
        const budget = (
          await createNewBudget(
            user.id,
            {
              name: "April",
              startAmount: 5000,
              categories: [
                { id: category.id, icon: "🎬", label: "Entertainment", amount: 1000 },
              ],
              recurringExpenseTemplateIds: [template.id],
            },
            ctx,
          )
        )._unsafeUnwrap();

        const result = await RecurringOperations.getInstancesByBudgetId(
          user.id,
          budget.id,
          ctx,
        );

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value).toHaveLength(1);
          expect(result.value[0]!.category?.id).toBe(category.id);
          expect(result.value[0]!.expense).toBeNull();
        }
      });
    });

    test("rejects when budget belongs to another user", async () => {
      await withTestTransaction(async (ctx) => {
        const owner = await createTestUser(ctx);
        const stranger = await createTestUser(ctx);
        const budget = await createTestBudget(ctx, owner.id);

        const result = await RecurringOperations.getInstancesByBudgetId(
          stranger.id,
          budget.id,
          ctx,
        );

        expect(result.isErr()).toBe(true);
      });
    });
  });
});
