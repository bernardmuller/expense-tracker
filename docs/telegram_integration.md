# Penny Bot — Telegram Integration Page

## Context

The backend already exposes CRUD for `chats` and `verifications`. The Telegram link flow works like this: the user creates a `verifications` row whose `identifier` is a fresh UUID and whose `value` is their `userId`; they DM the bot `/start <uuid>`; the bot looks up the verification by `identifier`, reads the `userId` from `value`, and writes a `chats` row pinning the user's Telegram `chatId`.

The frontend has no UI for this yet. The Settings hub needs a new entry that walks the user through three states:

1. **Linked** — a `chats` row exists for this user → show read-only `chatId`.
2. **Pending** — no chat row, but a `verifications` row exists with `value = userId` → show the deep-link to the bot, the `/start <uuid>` payload, and a "refresh" button.
3. **Disconnected** — neither exists → show a hero image and a "Enable Penny Bot" switch. Flipping it `POST`s a verification and transitions to Pending.

Two of the three states need to query "does a row exist matching my userId?" on `/chats` and `/verifications`. Both endpoints currently return the entire table with no filter support. The backend has a reusable pattern for this (`buildDrizzleQuery` + `parseSearchQuery`, currently wired into `/transactions`), so we extend `/chats` and `/verifications` to use it first, then the frontend can rely on typed query parameters.

## Shape of the change

```
┌─────────────────────────────────────────────────────────────────┐
│ Backend (must land first — regen depends on it)                  │
│                                                                  │
│  GET /chats           ─┐                                         │
│  GET /verifications   ─┴─► add request.query (zod) on .route.ts  │
│                            handler → parseSearchQuery → service  │
│                            service → forwards SearchQueries      │
│                            findAll → buildDrizzleQuery(filterMap)│
└──────────────┬──────────────────────────────────────────────────┘
               │  pnpm gen:types  (hits localhost:8080/doc)
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ Frontend                                                         │
│                                                                  │
│  schema.d.ts  ─►  /chats GET now has query.userId               │
│                   /verifications GET now has query.value         │
│                                                                  │
│  queries/chats/getChatsByUser.ts          ──► returns Chat|null │
│  queries/verifications/getVerificationByValue.ts ─► Verif|null  │
│  hooks/use-create-verification.ts         ──► POST /verifications│
│                                                                  │
│        ▼                  ▼                  ▼                   │
│   chat truthy?      verif truthy?       neither                  │
│        │                  │                  │                   │
│   ┌────▼────┐        ┌────▼────┐        ┌────▼────┐             │
│   │ Linked  │        │ Pending │        │  Switch │             │
│   │ chatId  │        │  link + │  ◄──── │  flips  │             │
│   │ readonly│        │  /start │        │  → POST │             │
│   └─────────┘        └─────────┘        └─────────┘             │
│        ▲                                                         │
│        └── refresh button invalidates both query keys            │
└─────────────────────────────────────────────────────────────────┘
```

## Backend changes

Mirror the `categoryExpenses` route's approach for declaring query params (it uses a `z.object` on `request.query` so they appear in the generated OpenAPI). The transactions route doesn't — that's why `schema.d.ts` shows `query?: never` for `/transactions`. We don't want that here; the frontend needs typed params.

### `back-end/src/features/chats/queries/findAll.ts`
Replace the bare select with the `getTransactions` pattern:

- Signature: `findAll(search: SearchQueries<Chat, { userId: string; chatId: string; type: string }>, ctx: AppContext)`.
- Build with `ctx.db.select().from(chats)` and pass to `buildDrizzleQuery` with:
  - `filterMap`: `userId → eq(chats.userId, value)`, `chatId → eq(chats.chatId, value)`, `type → eq(chats.type, value)`.
  - `sortColumns`: `{ createdAt: chats.createdAt }`.
- Wrap in `fromDB(...)`.

### `back-end/src/features/chats/services/getChats.ts`
Accept `search` as the first arg and forward it: `getChats(search, ctx) → ChatRepo.findAll(search, ctx)`.

### `back-end/src/features/chats/http/getChats.handler.ts`
Replace with the `getTransactionsHandler` shape: call `parseSearchQuery<Chat, { userId; chatId; type }>` with `filterKeys: ['userId', 'chatId', 'type']` and `allowedSortKeys: ['createdAt']`; chain `.asyncAndThen(search => getChats(search, createContext()))` and `.match` to the same JSON response.

### `back-end/src/features/chats/http/getChats.route.ts`
Add a new `chatsQueryParamsSchema` (place it under `chats/types/schemas/chatsQueryParams.schema.ts`, exported through `chats/types/schemas/index.ts`). Shape:

```ts
z.object({
  userId: z.string().uuid().optional(),
  chatId: z.string().optional(),
  type: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  sort: z.enum(['createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
})
```

Wire it into `getChatsRoute` via `request: { query: chatsQueryParamsSchema }`.

### Repeat for verifications
- `verifications/queries/findAll.ts`: filterMap `identifier → eq(verifications.identifier, v)`, `value → eq(verifications.value, v)`. Sort: `createdAt`.
- `verifications/services/getVerifications.ts`: accept and forward `search`.
- `verifications/http/getVerifications.handler.ts`: `parseSearchQuery` with `filterKeys: ['identifier', 'value']`, `allowedSortKeys: ['createdAt']`.
- `verifications/http/getVerifications.route.ts`: new `verificationsQueryParamsSchema` with optional `identifier`, `value`, `limit`, `offset`, `sort`, `order`.

### Regenerate frontend types
Start the back-end locally and run from `front-end/`:

```bash
pnpm gen:types
```

This fetches `http://localhost:8080/doc`, writes `schema.json`, and regenerates `schema.d.ts`. Confirm the generated `paths['/chats']['get']['parameters']['query']` and `paths['/verifications']['get']['parameters']['query']` are no longer `never`.

## Frontend changes

### 1. Hero image asset
The image is expected at `front-end/public/penny_bot.png` (referenced as `/penny_bot.png` since Vite serves `public/` from root). It is **not** currently in the repo on this branch — the implementer needs to add it (drag-drop, copy from the local machine, or download). The page should still render without the image (broken-image icon) so this isn't a blocker for the rest of the work.

### 2. Env var for the bot URL
Add `VITE_PENNY_BOT_URL` documentation. Since no `.env.example` exists yet in `front-end/` (only `VITE_API_URL` is referenced in `client.ts` without one), create `front-end/.env.example` with:

```
VITE_API_URL=http://localhost:8080
VITE_PENNY_BOT_URL=https://t.me/your_penny_bot
```

Do **not** create `.env.local` — it's gitignored. The implementer (and any other dev) sets it locally. Read as `import.meta.env.VITE_PENNY_BOT_URL` in the route component.

### 3. Extend `src/lib/http/query-keys.ts`
Append two top-level keys to the `queryKeys` object (preserving the existing shape):

```ts
chats: {
  all: ['chats'] as const,
  byUser: (userId: string) => ['chats', 'user', userId] as const,
},
verifications: {
  all: ['verifications'] as const,
  byValue: (value: string) => ['verifications', 'value', value] as const,
  create: () => ['verifications', 'create'] as const,
},
```

### 4. Query hooks
Create two files mirroring `lib/http/queries/users/getUserPreferences.ts` exactly (same `withAccessToken` + `toResult` + `getUserIdFromAccessToken` pattern, same throw-on-error contract for `useSuspenseQuery`):

- **`src/lib/http/queries/chats/getChatsByUser.ts`**
  - Internal `fetchChatsByUser(userId)` calls `client.GET('/chats', { params: { query: { userId } }, headers })`.
  - Returns `chats[0] ?? null` (consumer wants a single chat or "none").
  - `getChatsByUserQueryOptions(userId)` returns `{ queryKey: queryKeys.chats.byUser(userId), queryFn: () => fetchChatsByUser(userId) }`. No `staleTime` override — the refresh button uses `invalidateQueries` which forces a refetch regardless.

- **`src/lib/http/queries/verifications/getVerificationByValue.ts`**
  - `fetchVerificationByValue(userId)` calls `client.GET('/verifications', { params: { query: { value: userId } }, headers })`.
  - Returns `verifications[0] ?? null`.
  - `getVerificationByValueQueryOptions(userId)` returns `{ queryKey: queryKeys.verifications.byValue(userId), queryFn: () => fetchVerificationByValue(userId) }`.

### 5. Mutation hook
- **`src/lib/http/hooks/use-create-verification.ts`** mirroring `use-update-user-preferences.ts`:
  - `mutationFn` resolves `userId` via `getUserIdFromAccessToken()` (errAsync on failure, matching the existing pattern).
  - Body: `{ identifier: crypto.randomUUID(), value: userId, expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() }`. The bot resolves users by looking up the `identifier`, so the deep link uses this UUID.
  - `client.POST('/verifications', { headers, body })`.
  - On success: toast `"Penny Bot link ready — open Telegram to finish."` and `queryClient.invalidateQueries({ queryKey: queryKeys.verifications.byValue(userId) })`.
  - On error: toast the message.

### 6. New route `src/routes/profile.penny-bot.tsx`
Structure mirrors `routes/profile.preferences.tsx` (top `AppHeader.Root` with back button + center title + `ThemeToggle`, body wrapped in `Layout`, single `Card`). `beforeLoad: () => requireAuth()`. `loader` calls `context.queryClient.ensureQueryData` for both `getChatsByUserQueryOptions(userId)` and `getVerificationByValueQueryOptions(userId)` (decode `userId` inside the loader with `getUserIdFromAccessToken()`; if it fails, throw — `requireAuth` should have caught it).

Component reads both queries with `useSuspenseQuery` and branches on which is truthy:

- **Linked** (`chat` non-null): `<img src="/penny_bot.png" alt="Penny Bot" />`, heading "Connected to Telegram", `<p className="text-muted-foreground">Chat ID: {chat.chatId}</p>`. No edit controls.
- **Pending** (`chat` null, `verification` non-null): hero image, then a numbered list (use existing utility classes — no new component needed):
  1. `<Button asChild><a href={botUrl} target="_blank" rel="noreferrer">Open Penny Bot</a></Button>` where `botUrl = import.meta.env.VITE_PENNY_BOT_URL`.
  2. A `<pre>` or `<code>` block containing `/start {verification.identifier}` with a "Copy" button that calls `navigator.clipboard.writeText` (inline, no shared component needed — the rest of the codebase doesn't have a copy primitive).
  3. `<Button variant="outline">` "I've sent the message — refresh" that calls `queryClient.invalidateQueries` for both `queryKeys.chats.byUser(userId)` and `queryKeys.verifications.byValue(userId)`.
- **Disconnected** (both null): hero image, heading "Enable Penny Bot", short description, and `<Switch>` (from `components/ui/switch.tsx`) with a label. `onCheckedChange` calls `useCreateVerification().mutate()`. Switch is disabled while `mutation.isPending`. The Pending UI takes over as soon as the verification query invalidates and refetches.

Use existing primitives only: `AppHeader`, `Layout`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Button`, `Switch`, `Separator`. No new UI components.

### 7. Add Penny Bot row to Profile hub (`src/routes/profile.index.tsx`)
Inside the Settings `CardContent`, between the "Recurring Expenses" and "Clear Cache" rows, add:

```tsx
<div className="flex items-center justify-between">
  <div>
    <p className="text-foreground font-medium">Penny Bot</p>
    <p className="text-muted-foreground text-sm">Connect your Telegram account</p>
  </div>
  <Button variant="outline" asChild>
    <Link to="/profile/penny-bot">Configure</Link>
  </Button>
</div>
```

TanStack Router will pick up the new route file via the file-based router; rerun `pnpm dev` (or rely on the route plugin's auto-regen) to refresh `routeTree.gen.ts`.

## Critical files

| File | Change |
|---|---|
| `back-end/src/features/chats/queries/findAll.ts` | Rewrite to use `buildDrizzleQuery` |
| `back-end/src/features/chats/services/getChats.ts` | Accept & forward `search` |
| `back-end/src/features/chats/http/getChats.handler.ts` | `parseSearchQuery` chain |
| `back-end/src/features/chats/http/getChats.route.ts` | Add `request.query` schema |
| `back-end/src/features/chats/types/schemas/chatsQueryParams.schema.ts` | New |
| `back-end/src/features/verifications/queries/findAll.ts` | Same pattern |
| `back-end/src/features/verifications/services/getVerifications.ts` | Same |
| `back-end/src/features/verifications/http/getVerifications.{handler,route}.ts` | Same |
| `back-end/src/features/verifications/types/schemas/verificationsQueryParams.schema.ts` | New |
| `front-end/public/penny_bot.png` | New asset (add to repo) |
| `front-end/.env.example` | New file documenting `VITE_API_URL` + `VITE_PENNY_BOT_URL` |
| `front-end/src/lib/http/schema.{json,d.ts}` | Regenerated via `pnpm gen:types` |
| `front-end/src/lib/http/query-keys.ts` | Add `chats` + `verifications` keys |
| `front-end/src/lib/http/queries/chats/getChatsByUser.ts` | New |
| `front-end/src/lib/http/queries/verifications/getVerificationByValue.ts` | New |
| `front-end/src/lib/http/hooks/use-create-verification.ts` | New |
| `front-end/src/routes/profile.penny-bot.tsx` | New |
| `front-end/src/routes/profile.index.tsx` | Add Penny Bot row |

## Reusable utilities to lean on

- `buildDrizzleQuery` — `back-end/src/lib/utils/buildDrizzleQuery.ts:45`. Mirror `getTransactions.ts:21` for the integration.
- `parseSearchQuery` — `back-end/src/lib/utils/parseSearchQuery.ts:191`. Mirror `getTransactionsHandler` (`back-end/src/features/transactions/http/getTransactions.handler.ts:8`).
- `categoryExpensesQueryParamsSchema` (`back-end/src/features/categories/types/schemas/categoryExpensesParams.schema.ts:7`) — exact template for the new query-params schemas, including how it's referenced from `request.query` on the route.
- `withAccessToken` + `toResult` — `front-end/src/lib/http/with-token.ts`, `client.ts:85`.
- `getUserIdFromAccessToken` — `front-end/src/lib/auth/decode-token.ts:57`.
- `getUserPreferences.ts` & `use-update-user-preferences.ts` — direct templates for the new query and mutation hooks.
- `crypto.randomUUID()` — native in modern browsers, no dependency.

## Verification

1. **Backend** — from `back-end/`, run `pnpm test` (or `bun test`). Add a smoke case in `buildDrizzleQuery.test.ts` / `parseSearchQuery.test.ts` only if you remove coverage; the existing tests already exercise the helpers. Manually `curl 'http://localhost:8080/chats?userId=<uuid>'` and `curl 'http://localhost:8080/verifications?value=<uuid>'` to confirm filtering.
2. **OpenAPI regen** — start the back-end (`pnpm dev` in `back-end/`), then from `front-end/` run `pnpm gen:types`. Grep `schema.d.ts` for `paths["/chats"]["get"]["parameters"]["query"]` and confirm `userId?` is present, not `never`. Same for `/verifications` `value?`.
3. **Type-check + lint** — `pnpm lint` in `front-end/`; `tsc --noEmit` if available.
4. **Manual walkthrough** — start both servers, log in as a test user with no chat and no verification:
   - Land on `/profile` → Settings card shows the new "Penny Bot" row → click "Configure" → lands on `/profile/penny-bot`.
   - Disconnected state: hero image + switch. Flip switch → toast appears → view re-renders with Pending content showing the `/start <uuid>` block and "Open Penny Bot" button.
   - With the back-end running, manually `INSERT` a `chats` row for this `userId` (or run the real bot flow) → click "I've sent the message — refresh" → view switches to Linked with the `chatId`.
5. **Edge cases**
   - Refresh in Pending state while still pending: same UUID stays on screen (query refetch returns the same row).
   - Re-enable in Disconnected: a fresh UUID is minted; previous (now-orphaned) verification simply expires after 1h.
   - Both `userId`-derived hooks are independent — if `chats` and `verifications` both exist (race), Linked wins because of the chat-truthy branch order.
