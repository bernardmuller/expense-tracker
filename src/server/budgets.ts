import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db'
import { budgets, expenses } from '../db/schema'

const createBudgetSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, 'Budget name is required'),
  startAmount: z.number().positive('Start amount must be positive'),
})

const updateBudgetAmountSchema = z.object({
  budgetId: z.number(),
  amount: z.number(),
})

export const getActiveBudget = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const activeBudget = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, data.userId),
          eq(budgets.isActive, true)
        )
      )
      .orderBy(desc(budgets.createdAt))
      .limit(1)

    return activeBudget[0] || null
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

    return budget || null
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