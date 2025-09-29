import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        retry: (failureCount, error) => {
          if (error instanceof Error && 'status' in error &&
            typeof error.status === 'number' &&
            error.status >= 400 && error.status < 500) {
            return false
          }
          return failureCount < 3
        },
      },
      mutations: {
        retry: 1,
      },
    },
  })
}

export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,

  budgets: ['budgets'] as const,
  budget: (id: string | number) => ['budgets', id] as const,
  activeBudget: (userId: string) => ['budgets', 'active', userId] as const,
  budgetDetailsByUserId: (userId: string) => ['budgets', 'user', userId] as const,

  expenses: ['expenses'] as const,
  expense: (id: string | number) => ['expenses', id] as const,
  expensesByBudget: (budgetId: string | number) => ['expenses', 'budget', budgetId] as const,
  recentExpenses: (budgetId: string | number) => ['expenses', 'recent', budgetId] as const,
  allExpenses: (budgetId: string | number) => ['expenses', 'all', budgetId] as const,

  categoryBudgets: (budgetId: string | number) => ['categoryBudgets', budgetId] as const,
}
