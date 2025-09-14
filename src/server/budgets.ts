import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { desc, eq } from 'drizzle-orm'
import { db } from '../db'
import { budgets, categories, categoryBudgets } from '../db/schema'
import { getActiveBudgetByUserId } from './queries/budgets'

const createBudgetSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, 'Budget name is required'),
  startAmount: z.number().positive('Start amount must be positive'),
})

const createBudgetWithCategoriesSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, 'Budget name is required'),
  startAmount: z.number().positive('Start amount must be positive'),
  categoryAllocations: z.record(z.string(), z.number()).optional(),
})

const updateBudgetAmountSchema = z.object({
  budgetId: z.number(),
  amount: z.number(),
})


export const getActiveBudget = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return getActiveBudgetByUserId(data.userId)
  })

export const createBudget = createServerFn({ method: 'POST' })
  .validator(createBudgetSchema)
  .handler(async ({ data }) => {
    await db
      .update(budgets)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(budgets.userId, data.userId))

    const [newBudget] = await db
      .insert(budgets)
      .values({
        userId: data.userId,
        name: data.name,
        startAmount: data.startAmount.toString(),
        currentAmount: data.startAmount.toString(),
        isActive: true,
      })
      .returning()

    return newBudget
  })

export const updateBudgetAmount = createServerFn({ method: 'POST' })
  .validator(updateBudgetAmountSchema)
  .handler(async ({ data }) => {
    const [updatedBudget] = await db
      .update(budgets)
      .set({
        currentAmount: data.amount.toString(),
        updatedAt: new Date()
      })
      .where(eq(budgets.id, data.budgetId))
      .returning()

    return updatedBudget
  })

export const getBudgetById = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(eq(budgets.id, data.budgetId))
      .limit(1)

    return budget
  })

export const getUserBudgets = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    return await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, data.userId))
      .orderBy(desc(budgets.createdAt))
  })

export const createBudgetWithCategories = createServerFn({ method: 'POST' })
  .validator(createBudgetWithCategoriesSchema)
  .handler(async ({ data }) => {
    // Use a transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Deactivate existing budgets
      await tx
        .update(budgets)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(budgets.userId, data.userId))

      // Create new budget
      const [newBudget] = await tx
        .insert(budgets)
        .values({
          userId: data.userId,
          name: data.name,
          startAmount: data.startAmount.toString(),
          currentAmount: data.startAmount.toString(),
          isActive: true,
        })
        .returning()

      // Create category budget allocations if provided
      if (data.categoryAllocations && Object.keys(data.categoryAllocations).length > 0) {
        const categoryBudgetInserts = Object.entries(data.categoryAllocations).map(([categoryIdStr, amount]) => ({
          budgetId: newBudget.id,
          categoryId: parseInt(categoryIdStr),
          allocatedAmount: amount.toString(),
        }))

        await tx
          .insert(categoryBudgets)
          .values(categoryBudgetInserts)
      }

      return newBudget
    })

    return result
  })

export const getCategoryBudgets = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    return await db
      .select({
        id: categoryBudgets.id,
        budgetId: categoryBudgets.budgetId,
        categoryId: categoryBudgets.categoryId,
        allocatedAmount: categoryBudgets.allocatedAmount,
        category: {
          id: categories.id,
          key: categories.key,
          label: categories.label,
          icon: categories.icon,
        }
      })
      .from(categoryBudgets)
      .leftJoin(categories, eq(categoryBudgets.categoryId, categories.id))
      .where(eq(categoryBudgets.budgetId, data.budgetId))
  })
