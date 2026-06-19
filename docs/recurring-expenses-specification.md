# Recurring Expenses Feature - Complete Specification

## Overview

Users can define recurring expense templates (e.g., Netflix, Rent, Electric Bill) that automatically populate new budgets. Users tick off these expenses when paid, creating actual expense records.

**Key Concepts:**
- **Template**: Master definition in user settings (persistent across budgets)
- **Instance**: Budget-specific copy that can be ticked off
- **Snapshot Pattern**: Instances are immutable copies; template changes don't affect existing instances

---

## Database Schema

### Table 1: `recurring_expense_templates`

Master definitions owned by users.

```typescript
{
  id: uuid (PK)
  userId: uuid (FK → users.id, CASCADE DELETE)
  description: varchar(255) NOT NULL
  amount: decimal(10, 2) NOT NULL
  categoryId: uuid (FK → categories.id, SET NULL)  // soft delete compatible
  createdAt: timestamp NOT NULL
  updatedAt: timestamp NOT NULL
  deletedAt: timestamp (NULL = active, NOT NULL = soft deleted)
}

// Indexes
- userId (for user template lookup)
- userId + deletedAt (for active templates only)

// Constraints
- UNIQUE(userId, description) WHERE deletedAt IS NULL
```

### Table 2: `budget_recurring_expenses`

Budget-specific instances (snapshots from templates).

```typescript
{
  id: uuid (PK)
  budgetId: uuid (FK → budgets.id, CASCADE DELETE)
  description: varchar(255) NOT NULL  // snapshot
  amount: decimal(10, 2) NOT NULL     // snapshot
  categoryId: uuid (FK → categories.id, SET NULL)  // soft delete compatible, snapshot
  isPaid: boolean NOT NULL DEFAULT false
  expenseId: uuid (FK → expenses.id, SET NULL, NULLABLE)
  createdAt: timestamp NOT NULL
  updatedAt: timestamp NOT NULL
  deletedAt: timestamp (NULL = active)
}

// Indexes
- budgetId (for budget instance lookup)
- budgetId + deletedAt (for active instances)
- expenseId (for reverse lookup)

// Relations
- expenseId is NULL when unpaid, set when paid
- No FK to templates (snapshot pattern - instances are independent)
```

### Relations Summary

```
users (1) ──→ (many) recurring_expense_templates
budgets (1) ──→ (many) budget_recurring_expenses
budget_recurring_expenses (many) ──→ (1) expenses (when paid)
categories (1) ──→ (many) recurring_expense_templates
categories (1) ──→ (many) budget_recurring_expenses

Note: No FK between templates and instances (snapshot pattern)
```

---

## API Endpoints

### Template Management

#### `GET /users/{userId}/recurring-expenses`
**Description:** Get all active templates for user
**Auth:** Required (userId must match token)
**Query Params:**
- `includeDeleted: boolean` (default: false)

**Response:**
```typescript
{
  templates: Array<{
    id: string
    description: string
    amount: string
    categoryId: string
    category: { id, label, icon }
    createdAt: string
    updatedAt: string
  }>
}
```

#### `POST /users/{userId}/recurring-expenses`
**Description:** Create new template
**Auth:** Required
**Body:**
```typescript
{
  description: string (1-255 chars)
  amount: number (positive)
  categoryId: string (must exist)
}
```
**Response:** Created template object

#### `PATCH /recurring-expenses/{templateId}`
**Description:** Update template
**Auth:** Required (must own template)
**Body:** Partial of description, amount, categoryId
**Response:** Updated template object
**Business Rule:** Does NOT update existing budget instances (snapshot pattern)

#### `DELETE /recurring-expenses/{templateId}`
**Description:** Soft delete template
**Auth:** Required
**Response:** 204 No Content
**Business Rule:** Sets deletedAt, existing budget instances unaffected

---

### Budget Instance Management

#### `GET /budgets/{budgetId}/recurring-expenses`
**Description:** Get all instances for budget
**Auth:** Required (must own budget)
**Response:**
```typescript
{
  recurringExpenses: Array<{
    id: string
    budgetId: string
    description: string
    amount: string
    categoryId: string
    category: { id, label, icon }
    isPaid: boolean
    expenseId: string | null
    expense: { id, createdAt, ... } | null  // populated if paid
    createdAt: string
    updatedAt: string
  }>
}
```

#### `PATCH /budgets/{budgetId}/recurring-expenses/{instanceId}`
**Description:** Mark instance as paid or unpaid
**Auth:** Required (must own budget)
**Body (Mark as Paid):**
```typescript
{
  isPaid: true
  expenseData: {
    description: string  // can be edited from instance snapshot
    amount: number       // can be edited
    categoryId: string   // can be edited
    note?: string        // optional
    createdAt?: string   // defaults to now
  }
}
```
**Body (Mark as Unpaid):**
```typescript
{
  isPaid: false
}
```

**Business Logic (Mark Paid - isPaid: true):**
1. Validate instance exists and isPaid = false
2. Validate expenseData is provided
3. **Wrap in database transaction:**
   a. Create expense record in expenses table
   b. Deduct amount from budget.currentAmount
   c. Update categoryBudget spending
   d. Set instance.isPaid = true, instance.expenseId = createdExpenseId
4. Return created expense

**Business Logic (Mark Unpaid - isPaid: false):**
1. Validate instance exists and isPaid = true
2. **Wrap in database transaction:**
   a. Soft delete expense (set expenses.deletedAt)
   b. Add amount back to budget.currentAmount
   c. Update categoryBudget spending
   d. Set instance.isPaid = false, instance.expenseId = NULL
3. Return 204 No Content

**Response:**
- Mark paid: Created expense object
- Mark unpaid: 204 No Content

**Validation:**
- If `isPaid: true`, `expenseData` is required (400 if missing)
- If `isPaid: false`, `expenseData` must not be provided (400 if present)
- Must own the budget (403 if not)

**Race Condition Handling:**
- Frontend: Optimistic UI update with 200ms debounce on API calls
- Backend: Validate current isPaid state matches expectation
- Return 409 Conflict if state changed between read and update

#### `DELETE /budgets/{budgetId}/recurring-expenses/{instanceId}`
**Description:** Delete an unpaid recurring expense instance
**Auth:** Required (must own budget)
**Business Logic:**
1. Validate instance exists and isPaid = false (400 if already paid)
2. Soft delete instance (set deletedAt = NOW())
3. Return 204 No Content

**Response:** 204 No Content

**Use Case:** User selected wrong template during budget creation and wants to remove it

---

## Authorization Rules

All endpoints require authentication. Specific ownership rules:

### Template Endpoints
- **GET /users/{userId}/recurring-expenses**: `userId` must match authenticated user's ID (401/403)
- **POST /users/{userId}/recurring-expenses**: `userId` must match authenticated user's ID (401/403)
- **PATCH /recurring-expenses/{templateId}**: `template.userId` must match authenticated user's ID (403 if mismatch, 404 if not found)
- **DELETE /recurring-expenses/{templateId}**: `template.userId` must match authenticated user's ID (403 if mismatch, 404 if not found)

### Budget Instance Endpoints
- **GET /budgets/{budgetId}/recurring-expenses**: `budget.userId` must match authenticated user's ID (403 if mismatch, 404 if not found)
- **PATCH /budgets/{budgetId}/recurring-expenses/{instanceId}**: `instance.budget.userId` must match authenticated user's ID (403)
- **DELETE /budgets/{budgetId}/recurring-expenses/{instanceId}**: `instance.budget.userId` must match authenticated user's ID (403)

### Budget Creation with Templates
- **POST /users/{userId}/budget** with `recurringExpenseTemplateIds`:
  - All `templateIds` must exist and have `template.userId === req.user.id`
  - Return 400 Bad Request with error: "Template {templateId} not found or access denied"
  - Do NOT reveal whether template exists (security - prevent template ID enumeration)

### Error Responses
- **401 Unauthorized**: No auth token or invalid token
- **403 Forbidden**: Valid auth but user doesn't own the resource
- **404 Not Found**: Resource doesn't exist OR user doesn't own it (don't leak existence)

---

## User Flows

### Flow 1: Create Recurring Expense Template

**Location:** `/profile/recurring-expenses`

1. User navigates to Profile → Recurring Expenses
2. Clicks "Add Recurring Expense" button
3. Form appears with fields:
   - Description (text input)
   - Amount (number input)
   - Category (dropdown of user's categories)
4. User submits
5. POST `/users/{userId}/recurring-expenses`
6. Template appears in list

**UI Components:**
- List of templates (table or card grid)
- Add button → Dialog/Modal with form
- Edit icon per template → Same dialog, pre-filled
- Delete icon → Confirmation → Soft delete

---

### Flow 2: Create New Budget with Recurring Expenses

**Location:** `/budgets/new` (modified stepper)

**Updated Step Order:**
1. Step 1: Time Period
2. Step 2: Budget Info (name, startAmount)
3. Step 3: Select Categories
4. **Step 4: Select Recurring Expenses** ← NEW
5. Step 5: Allocate Categories

**Step 4 Details:**

**Card Header:** "Select Recurring Expenses"
**Description:** "Choose which recurring expenses apply to this budget period"

**Behavior:**
1. Fetch user's active templates: `GET /users/{userId}/recurring-expenses`
2. Display ALL templates with smart filtering:
   - If `template.categoryId IN selectedCategories` → Enabled checkbox (checked by default)
   - If `template.categoryId NOT IN selectedCategories` → Disabled checkbox with inline message:
     - "Add '{categoryName}' category to enable this expense"
     - One-click button/link to add category (updates Step 3 selection and re-enables)
3. User can uncheck enabled items that don't apply this period
4. Form state tracks: `recurringExpenseTemplateIds: string[]` (only enabled/selected items)

**Why show filtered items:** Prevents users from forgetting recurring expenses. Inline CTA allows one-click fix instead of abandoning the form.

**Example UI:**
```
☑ Netflix - R 159.99 - Entertainment
☑ Spotify - R 109.99 - Entertainment
☑ Electric Bill - R 1200.00 - Utilities
☐ Gym Membership - R 500.00 - Health (unchecked by user)
```

**Form Submission (Step 5 → Finish):**
```typescript
POST /users/{userId}/budget
{
  name: "April Budget",
  startAmount: 15000,
  startDate: "2026-04-01",
  endDate: "2026-04-30",
  budgetFrequency: "monthly",
  budgetStartDay: 1,
  categories: [
    { id: "cat-1", amount: 2000 },
    { id: "cat-2", amount: 5000 }
  ],
  recurringExpenseTemplateIds: ["template-1", "template-2"]  // ← NEW
}
```

**Backend Processing:**
**Wrap entire operation in database transaction:**
1. Validate all templateIds exist and belong to user (userId check)
   - If ANY template is missing or not owned, return 400 and rollback
2. Create budget record
3. Create category_budgets records
4. For each templateId in recurringExpenseTemplateIds:
   - Fetch template (within transaction)
   - Create budget_recurring_expense instance (snapshot: copy description, amount, categoryId)
5. Commit transaction
6. Return created budget

**Atomicity guarantee:** If ANY step fails, entire budget creation rolls back. No partial budgets.

---

### Flow 3: Tick Off Recurring Expense (Mark as Paid)

**Location:** Budget detail page (`/budgets/{id}`)

**Visual Layout:**
```
[Current Budget Card - existing]
[Recurring Expenses Card - NEW]
  Title: "Recurring Expenses"

  ☐ Netflix - R 159.99 - Entertainment
  ☐ Spotify - R 109.99 - Entertainment
  ☑ Electric Bill - R 1245.00 - Utilities (PAID - grayed/green)

[Expenses Link Card - existing]
[Category Breakdown Card - existing]
```

**Interaction:**
1. User clicks unchecked checkbox
2. Dialog opens: "Mark Expense as Paid"
3. Form shows (using existing AddExpenseForm component):
   - Description: [Netflix Subscription] (editable)
   - Amount: [159.99] (editable)
   - Category: [Entertainment ▼] (editable dropdown)
   - Date: [2026-03-17] (editable datepicker, defaults to today)
   - Note: [Optional text field]
4. User edits if needed (e.g., Electric Bill was R 1245 instead of R 1200)
5. Clicks "Create Expense"
6. PATCH `/budgets/{budgetId}/recurring-expenses/{instanceId}` with `{ isPaid: true, expenseData: {...} }`
7. Frontend optimistically updates UI (checkbox checked, 200ms debounce on API call)
8. Expense created, item shows as paid
9. Recent expenses list updates to show new expense

**Paid State Display:**
- Checkbox: checked, disabled
- Text: grayed out or green tint
- Icon: checkmark or "PAID" badge
- Show created expense date

---

### Flow 4: Untick Recurring Expense (Unmark as Paid)

**Location:** Same budget detail page

**Interaction:**
1. User clicks checked checkbox of paid item
2. Confirmation dialog: "Unmark Netflix as paid? This will delete the expense."
3. User confirms
4. PATCH `/budgets/{budgetId}/recurring-expenses/{instanceId}` with `{ isPaid: false }`
5. Frontend optimistically updates UI (checkbox unchecked, 200ms debounce)
6. Expense soft-deleted, budget currentAmount increases
7. Recent expenses list updates (paid expense disappears)

---

### Flow 5: Delete Unpaid Recurring Expense

**Location:** Budget detail page (`/budgets/{id}`)

**Use Case:** User selected "Gym Membership" during budget creation but realized they cancelled their gym membership.

**Interaction:**
1. User clicks trash/remove icon next to unpaid recurring expense
2. Confirmation dialog: "Remove Gym Membership from this budget?"
3. User confirms
4. DELETE `/budgets/{budgetId}/recurring-expenses/{instanceId}`
5. Instance soft-deleted (deletedAt set)
6. Item removed from recurring expenses list

**Note:** Delete option only appears for unpaid items. Paid items must be unmarked first before deletion.

---

## Business Rules & Edge Cases

### Rule 1: Template Changes Don't Affect Instances
- Template "Netflix" changes from R 159.99 to R 179.99
- Budget March instance still shows R 159.99 (snapshot)
- Budget April (created after change) shows R 179.99

### Rule 2: Template Deletion
- User soft-deletes "Gym Membership" template (deletedAt set)
- Existing budget instances remain unchanged (no FK to templates - snapshot pattern)
- Template stops appearing in Step 4 for new budgets (filtered by deletedAt IS NULL)
- Instances have no awareness of template deletion (fully independent)

### Rule 3: Category Filtering on Budget Creation
- User has template "Gym Membership - Health category"
- On Step 3 of budget creation, user doesn't select "Health"
- Step 4 shows "Gym Membership" but disabled with message: "Add 'Health' category to enable"
- User clicks inline CTA → "Health" added to Step 3 selection → "Gym Membership" becomes enabled
- Prevents users from forgetting recurring expenses

### Rule 4: Paid State Persistence
- March budget: Netflix marked paid (expense created)
- User edits template to R 179.99
- March instance: still R 159.99, still paid, expense unchanged

### Rule 5: Multiple Ticks (Not Allowed)
- Instance can only be paid once per budget period
- Once ticked, checkbox is disabled (can only untick to undo)
- To add multiple Netflix payments, use regular expense flow

### Rule 6: Budget Deletion Cascade
- Budget deleted → All budget_recurring_expenses instances deleted (CASCADE)
- Does NOT delete templates (templates are user-level)

### Rule 7: Category Deletion Handling
- Categories MUST use soft delete (set deletedAt)
- FK constraint: `categoryId` FK → `categories.id` with SET NULL (no CASCADE DELETE)
- When category is soft-deleted:
  - Templates/instances keep categoryId reference
  - UI shows deleted category as "(Deleted) Utilities" or similar placeholder
  - Historical data preserved for all past budgets
- Prevents data loss from accidental category deletion

### Rule 8: Amount Editing at Tick-Off
- User can edit amount when marking as paid
- Edited amount is used for expense creation
- Instance snapshot amount remains unchanged (for reference)
- Decision: Keep snapshot pure, don't update instance.amount

---

## Frontend Components

### New Components

1. **RecurringExpenseTemplateList** (`/profile/recurring-expenses`)
   - Lists all templates
   - Add/Edit/Delete actions
   - Uses Dialog for forms

2. **RecurringExpenseTemplateForm**
   - Reusable form for create/edit
   - Fields: description, amount, category
   - Zod validation

3. **RecurringExpenseSelectionStep** (Step 4 in `/budgets/new`)
   - Checkboxes for each template
   - Filtered by selected categories
   - Part of budget creation stepper

4. **RecurringExpensesCard** (`/budgets/{id}`)
   - Shows instances for budget
   - Checkboxes to mark paid/unpaid
   - Inline status indicators

5. **MarkRecurringExpensePaidDialog**
   - Wraps existing AddExpenseForm
   - Pre-fills fields from instance
   - Submits to mark-paid endpoint

### Modified Components

1. **NewBudgetPage** (`/budgets/new.tsx`)
   - Add Step 4 between current Step 3 and 4
   - Update step numbers
   - Add `recurringExpenseTemplateIds: string[]` to form schema
   - Pass to createBudget mutation

2. **BudgetDetailPage** (`/budgets/$id.index.tsx`)
   - Add RecurringExpensesCard between CurrentBudget and Expenses link

3. **Profile Routes**
   - Add `/profile/recurring-expenses` route

---

## Backend Implementation Checklist

### Database
- [ ] **PREREQUISITE**: Ensure `categories` table has `deletedAt` column for soft delete
- [ ] Create `recurring_expense_templates` table migration
  - [ ] NO CASCADE DELETE on categoryId (use SET NULL)
- [ ] Create `budget_recurring_expenses` table migration
  - [ ] NO templateId FK (snapshot pattern - instances are independent)
  - [ ] NO CASCADE DELETE on categoryId (use SET NULL)
- [ ] Add indexes (budgetId, userId, deletedAt combinations)
- [ ] Add foreign key constraints with correct ON DELETE behavior
- [ ] Update schema.ts with Drizzle definitions
- [ ] Add TypeScript types
- [ ] Create relations (note: no templates → instances relation)

### API - Templates Feature
- [ ] Create `/src/features/recurring-expenses/` folder structure
- [ ] Define Zod schemas for validation
- [ ] Implement queries:
  - [ ] `getTemplatesByUserId.ts`
  - [ ] `getTemplateById.ts`
- [ ] Implement actions:
  - [ ] `createTemplate.ts`
  - [ ] `updateTemplate.ts`
  - [ ] `softDeleteTemplate.ts`
- [ ] Create HTTP routes:
  - [ ] GET `/users/{userId}/recurring-expenses`
  - [ ] POST `/users/{userId}/recurring-expenses`
  - [ ] PATCH `/recurring-expenses/{templateId}`
  - [ ] DELETE `/recurring-expenses/{templateId}`
- [ ] Add auth middleware
- [ ] Add to OpenAPI spec

### API - Budget Instances Feature
- [ ] Add to budgets feature or create separate module
- [ ] Implement queries:
  - [ ] `getInstancesByBudgetId.ts`
  - [ ] `getInstanceById.ts`
- [ ] Implement actions:
  - [ ] `createInstancesFromTemplates.ts` (called during budget creation, wraps in transaction)
  - [ ] `updateInstancePaidStatus.ts` (handles both mark paid and unpaid with transaction)
  - [ ] `deleteUnpaidInstance.ts` (soft delete for unpaid instances)
- [ ] Create HTTP routes:
  - [ ] GET `/budgets/{budgetId}/recurring-expenses`
  - [ ] PATCH `/budgets/{budgetId}/recurring-expenses/{instanceId}` (mark paid/unpaid)
  - [ ] DELETE `/budgets/{budgetId}/recurring-expenses/{instanceId}` (delete unpaid only)
- [ ] Modify budget creation:
  - [ ] Update `createNewBudget.ts` to accept `recurringExpenseTemplateIds`
  - [ ] Validate all templateIds exist and belong to user (400 if not)
  - [ ] Wrap budget + instances creation in single transaction
  - [ ] Snapshot template data (description, amount, categoryId) to instances

### Business Logic
- [ ] Implement snapshot pattern (copy template values to instance, NO templateId FK)
- [ ] **Transaction wrappers** for all multi-table operations:
  - [ ] Mark paid: expense + budget + categoryBudget + instance (all or nothing)
  - [ ] Mark unpaid: expense soft-delete + budget restore + categoryBudget + instance
  - [ ] Budget creation: budget + categories + instances (atomic)
- [ ] Implement budget amount deduction on mark-paid
- [ ] Implement budget amount restoration on mark-unpaid
- [ ] Implement category budget spending updates
- [ ] Add validation:
  - [ ] Instance not already paid when marking paid (409 Conflict if changed)
  - [ ] Instance IS paid when marking unpaid
  - [ ] Instance is unpaid when deleting (400 if paid)
  - [ ] Amounts positive
  - [ ] All templateIds owned by user during budget creation

---

## Frontend Implementation Checklist

### Template Management Page
- [ ] Create `/profile/recurring-expenses.tsx` route
- [ ] Create `RecurringExpenseTemplateList` component
- [ ] Create `RecurringExpenseTemplateForm` component (Dialog-based)
- [ ] Implement React Query hooks:
  - [ ] `useRecurringExpenseTemplates()`
  - [ ] `useCreateTemplate()`
  - [ ] `useUpdateTemplate()`
  - [ ] `useDeleteTemplate()`
- [ ] Add query options to `/lib/http/queries/`
- [ ] Update OpenAPI schema types

### Budget Creation Flow
- [ ] Modify `/budgets/new.tsx`:
  - [ ] Add Step 4: Select Recurring Expenses
  - [ ] Renumber existing Step 4 to Step 5
  - [ ] Update stepper navigation
  - [ ] Add form field: `recurringExpenseTemplateIds: string[]`
  - [ ] Fetch templates in loader
  - [ ] **Smart filtering**: Show ALL templates, disable mismatched categories with inline CTA
  - [ ] Add to form submission payload
- [ ] Create `RecurringExpenseSelectionStep` component
  - [ ] Display all templates (enabled + disabled)
  - [ ] Inline message for disabled items: "Add 'Category' to enable"
  - [ ] One-click CTA to add missing category (updates Step 3 and re-enables)
- [ ] Update `newBudgetFormSchema` Zod schema
- [ ] Update `useCreateBudget` hook to include new field

### Budget Detail Page
- [ ] Modify `/budgets/$id.index.tsx`:
  - [ ] Add RecurringExpensesCard component
  - [ ] Position between CurrentBudget and Expenses link
- [ ] Create `RecurringExpensesCard` component
  - [ ] Fetch instances via React Query
  - [ ] Display list with checkboxes and delete icon (unpaid only)
  - [ ] Handle checkbox click → open mark paid/unpaid dialog
  - [ ] Handle delete icon click → confirm and soft delete unpaid instance
  - [ ] Show paid/unpaid states (grayed/green for paid)
- [ ] Create `MarkRecurringExpensePaidDialog` component
  - [ ] Reuse `AddExpenseForm` or similar
  - [ ] Pre-fill from instance snapshot data
  - [ ] Submit to PATCH endpoint with `isPaid: true, expenseData: {...}`
- [ ] Implement React Query hooks:
  - [ ] `useBudgetRecurringExpenses(budgetId)`
  - [ ] `useUpdateRecurringExpenseStatus()` (PATCH - mark paid/unpaid)
  - [ ] `useDeleteRecurringExpense()` (DELETE - unpaid only)
- [ ] **Add optimistic updates with 200ms debouncing:**
  - [ ] Optimistically update isPaid state in cache
  - [ ] Debounce API call by 200ms (cancel/restart on rapid clicks)
  - [ ] Rollback on error (409 Conflict if state changed)
- [ ] Handle cache invalidation (budget, expenses, category breakdowns)

### Shared/Utils
- [ ] Update OpenAPI schema generation
- [ ] Add TypeScript types to schema.d.ts
- [ ] Create query keys in `/lib/http/query-keys.ts`

---

## Testing Considerations

### Backend Tests
- [ ] Template CRUD operations
- [ ] Soft delete behavior
- [ ] Budget creation with templates (transaction rollback on failure)
- [ ] Mark paid/unpaid logic
- [ ] Budget amount calculations
- [ ] Category budget spending updates
- [ ] Edge cases (template deleted, category deleted, etc.)

### Frontend Tests
- [ ] Template list rendering
- [ ] Template form validation
- [ ] Step 4 category filtering
- [ ] Checkbox interactions
- [ ] Mark paid dialog submission
- [ ] Optimistic updates
- [ ] Error handling

---

## Open Questions / Future Enhancements

1. **Bulk Operations**: Should users be able to mark multiple recurring expenses as paid at once?
2. **History**: Should we track history of when recurring expenses were paid across budgets?
3. **Notifications**: Remind users about unpaid recurring expenses near budget end date?
4. **Recurrence Patterns**: Add optional fields (frequency, due date) for future smart features?
5. **Budget Templates**: Save entire budget setups (categories + recurring expenses + allocations) as reusable templates?
6. **Analytics**: Show spending trends for specific recurring expenses over time?

---

## Implementation Order Recommendation

### Phase 1: Backend Foundation
1. Database migrations (tables, indexes, constraints)
2. Update schema.ts with Drizzle definitions
3. Template CRUD endpoints
4. Budget instance read endpoint

### Phase 2: Template Management UI
1. Create profile route
2. Build template list and form components
3. Wire up React Query hooks
4. Test CRUD operations

### Phase 3: Budget Creation Integration
1. Modify budget creation flow (add Step 4)
2. Update backend budget creation to accept templateIds
3. Implement instance creation logic
4. Test end-to-end budget creation with recurring expenses

### Phase 4: Budget Detail Integration
1. Build RecurringExpensesCard component
2. Implement mark-paid endpoint
3. Implement mark-unpaid endpoint
4. Wire up UI with dialogs and optimistic updates
5. Test tick-off flow

### Phase 5: Polish & Testing
1. Add loading states and error handling
2. Implement soft delete cleanup
3. Write comprehensive tests
4. User acceptance testing
5. Documentation updates
