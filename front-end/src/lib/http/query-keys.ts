// Following this pattern: https://tkdodo.eu/blog/effective-react-query-keys
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    register: {
      all: ['auth', 'register'] as const,
      request: () => ['auth', 'register', 'request'] as const,
      verify: (token: string) => ['auth', 'register', 'verify', token] as const,
    },
    login: {
      all: ['auth', 'login'] as const,
      request: () => ['auth', 'login', 'request'] as const,
      verify: (token: string) => ['auth', 'login', 'verify', token] as const,
    },
    refresh: () => ['auth', 'refresh'] as const,
  },
  users: {
    all: ['users'] as const,
    current: ['users', 'current'] as const,
    onboard: () => ['users', 'onboard'] as const,
    categories: ['users', 'categories'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    active: (userId: string) => ['budgets', 'active', userId] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    create: () => ['transactions', 'create'] as const,
  },
} as const
