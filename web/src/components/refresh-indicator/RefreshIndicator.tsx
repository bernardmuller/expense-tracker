import { LoaderCircleIcon } from 'lucide-react'
import type { RefreshIndicatorProps } from './RefreshIndicator.types'

export function RefreshIndicator({ isRefreshing }: RefreshIndicatorProps) {
  if (!isRefreshing) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm
          shadow-md"
      >
        <LoaderCircleIcon className="h-4 w-4 animate-spin text-gray-500" />
        <span className="text-gray-600">Refreshing...</span>
      </div>
    </div>
  )
}
