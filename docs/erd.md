# Entity Relationship Diagram

Generated from `back-end/src/lib/db/schema.ts`.

```mermaid
erDiagram
    users ||--o| user_preferences : has
    users ||--o{ sessions : has
    users ||--o{ accounts : has
    users ||--o{ budgets : owns
    users ||--o{ user_categories : has
    users ||--o{ recurring_expense_templates : defines

    categories ||--o{ user_categories : "linked via"
    categories ||--o{ category_budgets : "linked via"
    categories ||--o{ expenses : categorizes
    categories ||--o{ recurring_expense_templates : categorizes
    categories ||--o{ budget_recurring_expenses : categorizes

    budgets ||--o{ category_budgets : allocates
    budgets ||--o{ expenses : contains
    budgets ||--o{ budget_recurring_expenses : contains

    expenses ||--o| budget_recurring_expenses : "materialized by"

    users {
        uuid id PK
        text name
        text email UK
        boolean email_verified
        text image
        boolean onboarded
        timestamp created_at
        timestamp updated_at
    }

    user_preferences {
        uuid id PK
        uuid user_id FK
        integer budget_start_date
        varchar frequency
        integer custom_duration
        timestamp created_at
        timestamp updated_at
    }

    sessions {
        uuid id PK
        timestamp expires_at
        text token UK
        timestamp created_at
        timestamp updated_at
        text ip_address
        text user_agent
        uuid user_id FK
    }

    accounts {
        uuid id PK
        uuid user_id FK
        text access_token
        text refresh_token
        text id_token
        timestamp access_token_expires_at
        timestamp refresh_token_expires_at
        text scope
        timestamp created_at
        timestamp updated_at
    }

    verifications {
        uuid id PK
        text identifier
        text value
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    budgets {
        uuid id PK
        uuid user_id FK
        varchar name
        varchar start_amount
        varchar current_amount
        varchar sa_iv
        varchar sa_tag
        varchar ca_iv
        varchar ca_tag
        boolean is_active
        timestamp start_date
        timestamp end_date
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    categories {
        uuid id PK
        varchar key UK
        varchar label
        varchar icon
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    user_categories {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    category_budgets {
        uuid id PK
        uuid budget_id FK
        uuid category_id FK
        decimal allocated_amount
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    expenses {
        uuid id PK
        uuid budget_id FK
        varchar description
        decimal amount
        uuid category_id FK
        varchar note
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    recurring_expense_templates {
        uuid id PK
        uuid user_id FK
        varchar description
        decimal amount
        uuid category_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    budget_recurring_expenses {
        uuid id PK
        uuid budget_id FK
        varchar description
        decimal amount
        uuid category_id FK
        boolean is_paid
        uuid expense_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
```

## Notifications

```mermaid
erDiagram
    users ||--o{ notification_preferences : has
    users ||--o{ notifications : receives

    notification_preferences {
        uuid id PK
        uuid user_id FK
        varchar type
        boolean enabled
        varchar channel
        time scheduled_at
        timestamp created_at
        timestamp updated_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        text message
        varchar channel
        timestamp sent_at
        timestamp created_at
    }
```

## Notes

- `user_categories` and `category_budgets` are junction tables. `user_categories` has a unique constraint on `(user_id, category_id)`.
- `recurring_expense_templates` are user-level definitions; `budget_recurring_expenses` are per-budget snapshots that optionally link to a materialized `expense` once paid (`expense_id` is `set null` on delete).
- `verifications` has no foreign keys and stands alone.
- All domain tables use soft deletes via `deleted_at`. Auth-related tables (`sessions`, `accounts`, `verifications`) do not.
- `recurring_expense_templates` enforces a partial unique index on `(user_id, description)` where `deleted_at IS NULL`.
