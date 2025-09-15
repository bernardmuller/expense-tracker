import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '../db'
import { budgets, expenses } from '../db/schema'
import { getRecentExpensesByBudgetId } from './queries/expenses/getRecentExpensesByBudgetId'

const createExpenseSchema = z.object({
  budgetId: z.number(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
})


export const createExpense = createServerFn({ method: 'POST' })
  .validator(createExpenseSchema)
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [newExpense] = await tx
        .insert(expenses)
        .values({
          budgetId: data.budgetId,
          description: data.description,
          amount: data.amount.toString(),
          category: data.category,
        })
        .returning()

      const [currentBudget] = await tx
        .select()
        .from(budgets)
        .where(eq(budgets.id, data.budgetId))
        .limit(1)

      const newCurrentAmount = parseFloat(currentBudget.currentAmount) - data.amount

      await tx
        .update(budgets)
        .set({
          currentAmount: newCurrentAmount.toString(),
          updatedAt: new Date()
        })
        .where(eq(budgets.id, data.budgetId))

      return {
        expense: newExpense,
        newBudgetAmount: newCurrentAmount
      }
    })
  })

export const getRecentExpenses = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    return await getRecentExpensesByBudgetId(data.budgetId)
  })

export const getAllExpenses = createServerFn({ method: 'GET' })
  .validator(z.object({
    budgetId: z.number(),
    limit: z.number().optional(),
    offset: z.number().optional()
  }))
  .handler(async ({ data }) => {
    let query = db
      .select()
      .from(expenses)
      .where(and(
        isNull(expenses.deletedAt),
        eq(expenses.budgetId, data.budgetId)
      ))
      .orderBy(desc(expenses.createdAt))

    if (data.limit) {
      query = query.limit(data.limit)
    }

    if (data.offset) {
      query = query.offset(data.offset)
    }

    return await query
  })

export const getExpenseById = createServerFn({ method: 'GET' })
  .validator(z.object({ expenseId: z.number() }))
  .handler(async ({ data }) => {
    const [expense] = await db
      .select()
      .from(expenses)
      .where(and(
        isNull(expenses.deletedAt),
        eq(expenses.id, data.expenseId)
      ))
      .limit(1)

    return expense || null
  })

export const deleteExpense = createServerFn({ method: 'POST' })
  .validator(z.object({ expenseId: z.number() }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const [expense] = await tx
        .select()
        .from(expenses)
        .where(eq(expenses.id, data.expenseId))
        .limit(1)

      console.log("expense => ", expense)

      const [deletedExpense] = await tx
        .update(expenses)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(expenses.id, data.expenseId))
        .returning()

      const [currentBudget] = await tx
        .select()
        .from(budgets)
        .where(eq(budgets.id, expense.budgetId))
        .limit(1)

      const newCurrentAmount = parseFloat(currentBudget.currentAmount) + parseFloat(expense.amount)

      await tx
        .update(budgets)
        .set({
          currentAmount: newCurrentAmount.toString(),
          updatedAt: new Date()
        })
        .where(eq(budgets.id, expense.budgetId))

      return deletedExpense
    })
  })

export const getExpenseCount = createServerFn({ method: 'GET' })
  .validator(z.object({ budgetId: z.number() }))
  .handler(async ({ data }) => {
    const result = await db
      .select({ count: expenses.id })
      .from(expenses)
      .where(and(
        isNull(expenses.deletedAt),
        eq(expenses.budgetId, data.budgetId)
      ))

    return result.length
  })

