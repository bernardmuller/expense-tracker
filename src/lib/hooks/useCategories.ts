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
      const { getAllCategoriesRoute } = await import('../../server/routes/categories/getAllCategoriesRoute')
      return getAllCategoriesRoute()
    },
  });
}

export function useUserCategories(userId: string | undefined) {
  return useQuery({
    queryKey: categoryQueryKeys.userCategories(userId || ''),
    queryFn: async () => {
      const { getUserCategoriesRoute } = await import('../../server/routes/categories/getUserCategoriesRoute')
      return getUserCategoriesRoute({ data: { userId: userId! } })
    },
    enabled: !!userId,
  });
}

export function useUserActiveCategories(userId: string | undefined) {
  return useQuery({
    queryKey: categoryQueryKeys.userActiveCategories(userId!),
    queryFn: async () => {
      const { getUserActiveCategoriesRoute } = await import('../../server/routes/categories/getUserActiveCategoriesRoute')
      return getUserActiveCategoriesRoute({ data: { userId: userId! } })
    },
    enabled: !!userId,
  });
}

export function useAddUserCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, categoryId }: { userId: string, categoryId: number }) => {
      const { addUserCategoryRoute } = await import('../../server/routes/categories/addUserCategoryRoute')
      return addUserCategoryRoute({ data: { userId, categoryId } })
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
      const { removeUserCategoryRoute } = await import('../../server/routes/categories/removeUserCategoryRoute')
      return removeUserCategoryRoute({ data: { userId, categoryId } })
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
      const { setupDefaultUserCategoriesRoute } = await import('../../server/routes/categories/setupDefaultUserCategoriesRoute')
      return setupDefaultUserCategoriesRoute({ data: { userId } })
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
