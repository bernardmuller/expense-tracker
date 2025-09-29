import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  revokeOtherSessions?: boolean
}

interface UseChangePasswordOptions {
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function useChangePassword({ onSuccess, onError }: UseChangePasswordOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const { changePasswordRoute } = await import('../../server/routes/auth/changePasswordRoute')
      return changePasswordRoute({ data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error)
    }
  })
}
