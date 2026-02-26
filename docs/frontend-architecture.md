# Expenny Frontend Architecture Review

## Project Overview

**Expenny** is a Progressive Web App (PWA) expense tracking application designed to help users build finance awareness habits. The app enables users to track expenses, manage budgets with recurring cycles, and gain insights into their spending patterns.

---

## Technology Stack

### Core Framework
- **React 19** with TypeScript
- **Vite** as the build tool
- **TanStack Router** (file-based routing with code splitting)
- **TanStack Query** for server state management with persistence
- **TanStack Form** for form handling

### UI & Styling
- **Tailwind CSS 4** for styling
- **Radix UI** components for accessible primitives
- **Shadcn UI** component library
- **Motion** (Framer Motion) for animations
- **Lucide React** for icons
- **next-themes** for dark/light theme support

### Data & API
- **openapi-fetch** for type-safe API calls
- **neverthrow** for functional error handling
- Auto-generated TypeScript types from OpenAPI schema

### PWA & Mobile
- **vite-plugin-pwa** for Progressive Web App capabilities
- Responsive design with mobile-first approach
- Swipe gestures for mobile interactions

---

## Architecture & Structure

### Project Organization
```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI primitives (Shadcn)
│   ├── add-expense-form/
│   ├── recent-expenses/
│   ├── current-budget/
│   ├── budget-breakdowns/
│   └── ...
├── routes/           # File-based routes (TanStack Router)
│   ├── dashboard.tsx
│   ├── onboarding.tsx
│   ├── budgets/
│   └── profile/
├── lib/
│   ├── http/         # API client, queries, hooks
│   ├── auth/         # Authentication logic
│   ├── utils/        # Utility functions
│   └── hooks/        # Custom React hooks
└── main.tsx          # App entry point
```

### Key Architecture Patterns
- **Compound Component Pattern** - Used in AppHeader, CurrentBudget components
- **Query-based data fetching** - TanStack Query with prefetching in route loaders
- **Type-safe API client** - Auto-generated types from OpenAPI schema
- **Route guards** - Authentication requirements via `beforeLoad`
- **Suspense boundaries** - Loading states with skeleton components

---

## Core Features

### 1. Authentication
Location: `src/lib/auth/`

- JWT-based authentication with access/refresh tokens (`token-storage.ts`)
- Automatic token refresh on 401 responses (`src/lib/http/client.ts:64`)
- Route guards protecting authenticated pages (`route-guard.ts`)
- Email-based registration with OTP verification

### 2. Onboarding Flow
Location: `src/routes/onboarding.tsx`

Multi-step guided setup:
- **Step 1**: Choose budget frequency (weekly, bi-weekly, monthly, custom)
- **Step 2**: Set budget name and starting amount
- **Step 3**: Select and allocate money to expense categories
- **Step 4**: Review and confirm

### 3. Budget Management
Location: `src/routes/dashboard.tsx`, `src/routes/budgets/`

- **Active budget tracking** with real-time updates
- **Budget cycles** - Recurring budgets with configurable frequency
- **Budget countdown** - Shows days remaining in current cycle
- **Start amount vs current amount** tracking
- **Spent percentage** visualization with progress bars

### 4. Expense Tracking
Location: `src/components/add-expense-form/`

- Quick expense entry form (description, amount, category)
- **Advanced options** - Custom date and notes
- Auto-fill description from category if not provided
- Category-based expense organization
- **Recent expenses list** - Shows last 5 expenses on dashboard
- **Swipe to delete** on mobile devices

### 5. Category Breakdown
Location: `src/routes/budgets/$id.index.tsx`

Three types of category states:
- **Planned** - Categories with allocations, spending within budget
- **Over Budget** - Spending exceeds allocated amount
- **Unplanned** - Spending without allocation

### 6. Budget Detail View
Location: `src/routes/budgets/$id.index.tsx`

- Total expenses count across categories
- Category breakdown with visual indicators
- Click-through to filtered expense lists
- Create new budgets

---

## Habit-Building Features

The app promotes finance awareness through:

1. **Visual Budget Progress** - Constantly visible current budget status
2. **Category Allocations** - Forces upfront planning of spending
3. **Over-budget Indicators** - Red flags when exceeding category limits
4. **Recent Expenses Visibility** - Immediate feedback on spending
5. **Budget Cycles** - Regular recurring periods encourage consistent tracking
6. **Confetti Celebrations** - Positive reinforcement after onboarding
7. **Privacy Mode** - Quick toggle to hide amounts (useful in public)

---

## Notable Technical Features

### Authentication & Security
- HTTP-only cookies support
- Automatic token refresh with request retry
- Secure token storage in localStorage
- User ID extraction from JWT tokens (`src/lib/auth/decode-token.ts`)

### Data Management
- **Optimistic updates** via TanStack Query mutations
- **Persistent cache** for offline support
- **Prefetching** in route loaders for instant page loads
- **Suspense-based loading** with skeleton screens

### User Experience
- **Theme support** - Dark/light mode with system preference detection
- **Privacy toggle** - Hides monetary values (`src/lib/hooks/usePrivacy.ts`)
- **Refresh indicator** - Shows when data is being fetched
- **Mobile-optimized** - Swipe gestures, responsive layout
- **PWA capabilities** - Installable, offline support, native app feel

### Developer Experience
- **Storybook integration** - Component development and testing
- **Vitest** for unit testing
- **Type-safe API** - Auto-generated from OpenAPI spec (`src/lib/http/schema.d.ts`)
- **Prettier & ESLint** - Code formatting and linting
- **Compound components** - Flexible, composable UI patterns

---

## Routes & Navigation

### Public Routes
- `/login` - Email authentication
- `/register` - User registration with OTP

### Protected Routes
- `/dashboard` - Main view with budget overview and quick expense entry
- `/onboarding` - Initial setup flow for new users
- `/budgets/new` - Create new budget
- `/budgets/$id` - Budget detail with category breakdown
- `/budgets/$id/expenses` - All expenses for a budget (with filtering)
- `/profile` - User settings
- `/profile/preferences` - App preferences

---

## Component Architecture

### Compound Components
Used for flexible, composable interfaces:

**AppHeader** - Reusable header with Left/Center/Right sections
```tsx
<AppHeader.Root>
  <AppHeader.Left>
    <AppHeader.Icon src="/favicon.ico" alt="App Icon" />
    <AppHeader.Info appName="Expenny" message={`Hi, ${user.name}!`} />
  </AppHeader.Left>
  <AppHeader.Right>
    <ThemeToggle />
  </AppHeader.Right>
</AppHeader.Root>
```

**CurrentBudget** - Budget display with various configurations
- `CurrentBudget` - Basic budget display with privacy toggle
- `CurrentBudgetWithBadge` - Includes days remaining badge
- `CurrentBudgetWithoutAction` - Display only, no interactions

### Form Handling
Location: `src/hooks/form.ts`

- Custom form wrapper using TanStack Form
- Field-level validation with Zod schemas
- Reusable field components:
  - `TextField` - Text input
  - `NumberField` - Numeric input
  - `SearchableSelectField` - Filterable dropdown

### Skeleton States
Dedicated skeleton components for loading states:
- `DashboardSkeleton` (`src/routes/dashboard.skeleton.tsx`)
- `CurrentBudget.skeleton`
- `RecentExpenses.skeleton`
- `AddExpenseForm.skeleton`

---

## Data Flow

### 1. API Client
Location: `src/lib/http/client.ts`

- OpenAPI-based typed client using `openapi-fetch`
- Automatic auth header injection via middleware
- Token refresh on 401 responses
- Credential inclusion for cookie-based auth

### 2. Query Layer
Location: `src/lib/http/queries/`

- Pre-defined query options for common queries
- Centralized query keys (`src/lib/http/query-keys.ts`)
- Key query options:
  - `getActiveBudgetQueryOptions()` - Current budget
  - `getCategoriesQueryOptions()` - Expense categories
  - `getUserByIdQueryOptions()` - User profile
  - `getBudgetByIdQueryOptions(id)` - Specific budget details

### 3. Custom Hooks
Location: `src/lib/http/hooks/`

Mutation hooks for write operations:
- `useCreateTransaction` - Add expenses
- `useDeleteExpense` - Remove expenses
- `useOnboardRequest` - Complete onboarding

### 4. Route Loaders
Each route can define a loader to prefetch data:

```tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(getActiveBudgetQueryOptions())
    context.queryClient.prefetchQuery(getCategoriesQueryOptions())
    await context.queryClient.ensureQueryData(getUserByIdQueryOptions())
  },
  component: DashboardPage,
})
```

---

## Key Code Patterns

### Error Handling
Using `neverthrow` for functional error handling:

```tsx
export function toResult<T, E>(
  promise: Promise<{ data?: T; error?: E; response: Response }>,
): ResultAsync<T, E> {
  return ResultAsync.fromPromise(promise, (e) => e as E).andThen(
    ({ data, error }) => {
      if (error) return err(error)
      if (data !== undefined) return ok(data)
      return err(error as E)
    },
  )
}
```

### Form Validation
Using Zod schemas with TanStack Form:

```tsx
const addExpenseSchema = z.object({
  description: z.string(),
  amount: z.number().positive('You must provide the amount'),
  category: z.string().refine((val) => val !== '', {
    message: 'You must specify a category',
  }),
  createdAt: z.string(),
  note: z.string(),
})

const form = useAppForm({
  defaultValues: { /* ... */ },
  validators: {
    onSubmit: addExpenseSchema,
  },
  onSubmit: ({ value }) => {
    // Handle submission
  },
})
```

### Route Guards
Protecting authenticated routes:

```tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => requireAuth(),
  // ...
})
```

---

## File Structure Conventions

### Component Organization
Each major component follows this pattern:
```
component-name/
├── ComponentName.tsx          # Main component
├── ComponentName.types.tsx    # Type definitions
├── ComponentName.skeleton.tsx # Loading state
├── __tests__/
│   ├── ComponentName.test.tsx    # Unit tests
│   └── ComponentName.stories.tsx # Storybook stories
└── __mocks__/
    └── ComponentName.mocks.tsx   # Test fixtures
```

### Naming Conventions
- **Components**: PascalCase (e.g., `AddExpenseForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePrivacy.ts`)
- **Utils**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase with descriptive suffix (e.g., `InsightCardProps`)

---

## Build & Deployment

### Build Configuration
Location: `vite.config.ts`

- Vite with React plugin
- TanStack Router plugin with auto code splitting
- PWA plugin for service worker generation
- Netlify plugin for deployment
- React Compiler plugin for optimization
- Path aliases: `@/` → `./src/`

### PWA Configuration
Location: `public/manifest.json`

- App name: "Expenny"
- Theme color: `#1c1917` (dark theme)
- Standalone display mode (fullscreen app)
- Portrait orientation
- Multiple icon sizes for various devices
- Maskable icons for Android adaptive icons

### Scripts
```json
{
  "dev": "vite --host --port 3000",
  "build": "vite build",
  "test:watch": "vitest",
  "lint": "eslint",
  "format": "prettier",
  "storybook": "storybook dev -p 6006",
  "gen:types": "tsx scripts/build-api-types.ts"
}
```

---

## Key Observations

### Strengths
✅ Modern, type-safe tech stack
✅ Excellent separation of concerns
✅ Strong focus on UX (privacy mode, swipe actions, themes)
✅ Progressive Web App for cross-platform reach
✅ Comprehensive testing setup with Storybook
✅ Habit-building features through visual feedback
✅ Mobile-first responsive design
✅ Accessible UI with Radix primitives
✅ Functional error handling for safer code
✅ Auto-generated API types ensure contract compliance

### Architecture Highlights
- **File-based routing** makes adding features straightforward
- **Compound components** provide flexibility without prop drilling
- **Query-based state** eliminates manual cache management
- **OpenAPI integration** ensures API contract compliance
- **Route loaders with prefetching** deliver instant page loads
- **Suspense boundaries** provide smooth loading experiences
- **Token refresh middleware** handles auth transparently

### Design Philosophy
The application emphasizes:
1. **Type Safety** - End-to-end TypeScript with generated API types
2. **Developer Experience** - Hot reload, Storybook, clear patterns
3. **User Experience** - Fast loads, offline support, smooth animations
4. **Habit Formation** - Visual feedback, regular cycles, positive reinforcement
5. **Accessibility** - Radix UI primitives, keyboard navigation, screen reader support

---

## Future Considerations

### Potential Enhancements
- Budget insights/analytics dashboard
- Recurring expense templates
- Budget sharing/collaboration features
- Export capabilities (CSV, PDF)
- Push notifications for budget alerts
- Receipt photo attachments
- Multi-currency support
- Budget templates/presets

### Technical Improvements
- Offline-first architecture with sync
- End-to-end tests with Playwright
- Performance monitoring
- Error tracking (Sentry)
- A/B testing framework
- Internationalization (i18n)

---

## Conclusion

This is a well-architected, modern expense tracking application with a strong focus on user experience and habit formation. The technology choices (React 19, TanStack ecosystem, Radix UI, Vite) demonstrate a commitment to performance, type safety, and developer experience. The compound component pattern, query-based state management, and file-based routing create a maintainable and scalable foundation for future growth.

The app's habit-building features—visual budget progress, category allocations, over-budget indicators, and recurring cycles—position it as more than just an expense tracker, but as a tool for developing lasting financial awareness.
