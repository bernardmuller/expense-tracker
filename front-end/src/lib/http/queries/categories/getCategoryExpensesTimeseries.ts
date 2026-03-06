import { toast } from 'sonner'
import { format } from 'date-fns'
import { withAccessToken } from '../../with-token'
import { client, toResult } from '../../client'
import { queryKeys } from '../../query-keys'
import type { paths } from '../../schema'
import type { MonthlyChartData } from '@/components/category-chart/CategoryChart.types'

export type CategoryExpensesTimeseriesSuccess =
  paths['/categories/{categoryId}/expenses/timeseries']['get']['responses']['200']['content']['application/json']

type CategoryExpensesTimeseriesError =
  | paths['/categories/{categoryId}/expenses/timeseries']['get']['responses']['404']['content']['application/json']
  | paths['/categories/{categoryId}/expenses/timeseries']['get']['responses']['401']['content']['application/json']

export async function fetchCategoryExpensesTimeseries(
  categoryId: string,
  months?: number,
): Promise<CategoryExpensesTimeseriesSuccess> {
  const result = await withAccessToken(
    (ctx) => {
      return toResult(
        client.GET('/categories/{categoryId}/expenses/timeseries', {
          params: {
            path: { categoryId },
            query: months ? { months } : undefined,
          },
          headers: {
            authorization: `Bearer ${ctx.token}`,
          },
        }),
      )
    },
    (): CategoryExpensesTimeseriesError => ({
      error: 'Unauthorized',
      message: 'No access token found',
      code: 'MISSING_ACCESS_TOKEN',
    }),
  )()

  return result.match(
    (data) => data,
    (error) => {
      toast.error(error.message || 'Failed to get category timeseries data')
      throw error
    },
  )
}

/**
 * Transform timeseries API response to CategoryChart format
 */
export function transformTimeseriesData(
  data: CategoryExpensesTimeseriesSuccess,
): MonthlyChartData[] {
  return data.timeseries.map((item) => ({
    month: format(new Date(item.period), 'MMM yyyy'),
    spent: item.totalAmount,
    budget: undefined, // Will be implemented later
  }))
}

export function getCategoryExpensesTimeseriesQueryOptions(
  categoryId: string,
  months?: number,
) {
  return {
    queryKey: queryKeys.categories.timeseries(categoryId, months),
    queryFn: () => fetchCategoryExpensesTimeseries(categoryId, months),
  }
}
