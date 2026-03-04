# Task: Implement `GET /categories/{categoryId}/expenses/timeseries`

## Overview

Build a REST endpoint that returns monthly expense totals for a given budget category over a configurable lookback window. The authenticated user is inferred from the auth token — never from the URL path.

## Route

```
GET /categories/{categoryId}/expenses/timeseries
```

## Path Parameters

| Param        | Type | Description                    |
| ------------ | ---- | ------------------------------ |
| `categoryId` | UUID | The expense category to query. |

## Query Parameters

| Param    | Type    | Default | Description                                                                      |
| -------- | ------- | ------- | -------------------------------------------------------------------------------- |
| `months` | integer | `6`     | Number of months to include (current month + N-1 previous months). Min 1, max 24. |

## Authentication

The `userId` must be extracted from the authenticated session/token. Do not accept a user ID as a path or query parameter.

## Database Query

Use the following query as the basis for the implementation. Adapt it to your ORM/query builder as needed, but preserve the semantics — especially the `generate_series` zero-fill so that months with no expenses still appear in the response.

```sql
WITH months AS (
  SELECT generate_series(
    date_trunc('month', CURRENT_DATE) - INTERVAL '{months - 1} months',
    date_trunc('month', CURRENT_DATE),
    INTERVAL '1 month'
  )::date AS month_start
),
expense_totals AS (
  SELECT
    date_trunc('month', e."created_at")::date AS month_start,
    COUNT(*) AS expense_count,
    SUM(e."amount") AS total_amount
  FROM "expenses" e
  JOIN "budgets" b ON e."budget_id" = b."id"
  WHERE b."user_id" = :userId
    AND e."category_id" = :categoryId
    AND e."created_at" >= date_trunc('month', CURRENT_DATE) - INTERVAL '{months - 1} months'
  GROUP BY date_trunc('month', e."created_at")
)
SELECT
  m.month_start,
  COALESCE(et.expense_count, 0) AS expense_count,
  COALESCE(et.total_amount, 0) AS total_amount
FROM months m
LEFT JOIN expense_totals et USING (month_start)
ORDER BY m.month_start DESC;
```

## Response

### 200 OK

```json
{
  "categoryId": "324f5b0a-ab1f-4f6e-9fb4-68c4c98bdb41",
  "granularity": "month",
  "timeseries": [
    {
      "period": "2025-10-01",
      "expenseCount": 12,
      "totalAmount": 340.50
    },
    {
      "period": "2025-11-01",
      "expenseCount": 0,
      "totalAmount": 0
    }
  ]
}
```

- `timeseries` is ordered by `period` descending (most recent first).
- Every month in the window must be present, even if `expenseCount` and `totalAmount` are both `0`.
- `totalAmount` should be a number (not a string). Preserve two decimal places where applicable.

### Error Responses

| Status | Condition                                                                        |
| ------ | -------------------------------------------------------------------------------- |
| 400    | `categoryId` is not a valid UUID, or `months` is out of range.                   |
| 401    | Missing or invalid auth.                                                         |
| 404    | `categoryId` does not exist or does not belong to the authenticated user.        |

## Requirements

- Validate `categoryId` format and `months` range before hitting the database.
- Confirm the category belongs to the authenticated user; return 404 if not (do not leak existence of other users' categories).
- Use parameterized queries — no string interpolation of user input into SQL.
- Follow existing project conventions for routing, middleware, error handling, and response formatting.

## Important Notes

- Follow the same 4 layer architecture pattern found in the project
- Do not create any new Error types, use the ones in already defined.
