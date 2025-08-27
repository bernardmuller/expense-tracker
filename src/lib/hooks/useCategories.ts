import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const categoryQueryKeys = {
  all: ['categories'] as const,
  allCategories: () => [...categoryQueryKeys.all, 'all'] as const,
  userCategories: (userId: string) => [...categoryQueryKeys.all, 'user', userId] as const,
  userActiveCategories: (userId: string) => [...categoryQueryKeys.all, 'user-active', userId] as const,
};

export function useAllCategories() {
  return useQuery({
    queryKey: categoryQueryKeys.allCategories(),
    queryFn: async () => {
      const { getAllCategories } = await import('../../server/categories')
      return getAllCategories()
    },
  });
}

export function useUserCategories(userId: string | undefined) {
  return useQuery({
    queryKey: categoryQueryKeys.userCategories(userId || ''),
    queryFn: async () => {
      const { getUserCategories } = await import('../../server/categories')
      return getUserCategories({ data: { userId: userId! } })
    },
    enabled: !!userId,
  });
}

export function useUserActiveCategories(userId: string | undefined) {
  return useQuery({
    queryKey: categoryQueryKeys.userActiveCategories(userId!),
    queryFn: async () => {
      const { getUserActiveCategories } = await import('../../server/categories')
      return getUserActiveCategories({ data: { userId: userId! } })
    },
    enabled: !!userId,
  });
}

export function useAddUserCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, categoryId }: { userId: string, categoryId: number }) => {
      const { addUserCategory } = await import('../../server/categories')
      return addUserCategory({ data: { userId, categoryId } })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.userCategories(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.userActiveCategories(variables.userId),
      });
    },
  });
}

export function useRemoveUserCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, categoryId }: { userId: string, categoryId: number }) => {
      const { removeUserCategory } = await import('../../server/categories')
      return removeUserCategory({ data: { userId, categoryId } })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.userCategories(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.userActiveCategories(variables.userId),
      });
    },
  });
}

export function useSetupDefaultUserCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { setupDefaultUserCategories } = await import('../../server/categories')
      return setupDefaultUserCategories({ data: { userId } })
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.userCategories(userId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.userActiveCategories(userId),
      });
    },
  });
}
