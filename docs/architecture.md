# Backend Architecture Guide

> **A practical guide to building maintainable, type-safe backend services with excellent developer experience**

## Table of Contents

- [Philosophy](#philosophy)
- [Architecture Overview](#architecture-overview)
- [Layer Definitions](#layer-definitions)
  - [HTTP Layer](#http-layer)
  - [Service Layer](#service-layer)
  - [Domain Layer](#domain-layer)
  - [Repository Layer](#repository-layer)
- [Error Handling Strategy](#error-handling-strategy)
  - [Error Type System](#error-type-system)
  - [Result Type Wrapper](#result-type-wrapper)
  - [Error Flow Pattern](#error-flow-pattern)
- [Complete Example](#complete-example)
- [Testing Strategy](#testing-strategy)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

---

## Philosophy

This architecture prioritizes:

1. **Developer Experience**: Minimal boilerplate, clear error messages, fast iteration
2. **Type Safety**: Compile-time guarantees where they matter most
3. **Testability**: Pure functions, clear boundaries, easy mocking
4. **Maintainability**: Changes should be localized, not cascading
5. **Pragmatism**: Type safety at boundaries, flexibility internally

### Core Principles

- **Narrow at boundaries, wide internally** - Be explicit at layer edges, flexible inside
- **Pure domain logic** - Business rules should be testable without infrastructure
- **Structural error handling** - Runtime checks over exhaustive compile-time unions
- **Composition over configuration** - Build complex operations from simple pieces

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      HTTP Layer                         │
│  • Route definitions + OpenAPI schemas                  │
│  • Request/response handling                            │
│  • Authentication/authorization                         │
│  • Error serialization                                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                        │
│  • Orchestration & composition                          │
│  • Transaction management                               │
│  • Cross-domain coordination                            │
│  • Wide error types (AppResult<T>)                     │
└─────────────────────────────────────────────────────────┘
                            ↓
          ┌─────────────────┴─────────────────┐
          ↓                                     ↓
┌──────────────────────┐          ┌──────────────────────┐
│    Domain Layer      │          │  Repository Layer    │
│  • Pure functions    │          │  • Database access   │
│  • Business rules    │          │  • Query building    │
│  • Calculations      │          │  • Data mapping      │
│  • Validations       │          │  • Narrow errors     │
│  • Narrow errors     │          └──────────────────────┘
└──────────────────────┘
```

### Directory Structure

```
src/
├── features/
│   └── orders/
│       ├── http/                 # HTTP Layer
│       │   ├── createOrder.handler.ts
│       │   ├── createOrder.route.ts
│       │   ├── getOrders.handler.ts
│       │   └── getOrders.route.ts
│       ├── services/             # Service Layer
│       │   └── orders.service.ts
│       ├── domain/               # Domain Layer
│       │   ├── order-pricing.domain.ts
│       │   ├── order-validation.domain.ts
│       │   └── order-status.domain.ts
│       ├── repositories/         # Repository Layer
│       │   └── orders.repository.ts
│       └── types/                # Shared types
│           ├── order.types.ts
│           └── schemas.ts
└── lib/
    ├── result.ts                 # AppResult wrapper
    └── errors/
        ├── base.ts               # Base error classes
        └── domain.ts             # Domain error definitions
```

---

## Layer Definitions

### HTTP Layer

**Purpose**: Handle HTTP concerns - routing, request/response serialization, authentication

**Responsibilities**:
- Define routes with OpenAPI schemas
- Parse and validate request parameters
- Call service layer functions
- Convert Results to HTTP responses
- Handle authentication/authorization

**Should NOT**:
- Contain business logic
- Access database directly
- Transform domain objects (beyond serialization)
- Handle specific error types (use structural handling)

**Example**:

```typescript
// features/orders/http/createOrder.handler.ts
import type { Context } from 'hono';
import { handleResult } from '@/lib/http/resultHandler';
import * as OrderService from '../services/orders.service';

export const createOrderHandler = async (c: Context) => {
  // 1. Extract request data
  const body = await c.req.json();
  const user = c.get('user');
  const ctx = createContext();

  // 2. Call service layer
  const result = await OrderService.createOrder({
    userId: user.id,
    items: body.items,
    shippingAddress: body.shippingAddress,
  }, ctx);

  // 3. Handle result generically
  return handleResult(result, c);
};
```

```typescript
// features/orders/http/createOrder.route.ts
import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

export const createOrderRoute = createRoute({
  path: '/orders',
  method: 'post',
  tags: ['Orders'],
  request: {
    body: jsonContent(
      z.object({
        items: z.array(z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })),
        shippingAddress: z.object({
          street: z.string(),
          city: z.string(),
          postalCode: z.string(),
        }),
      }),
      'Order creation request'
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        id: z.string().uuid(),
        total: z.string(),
        status: z.string(),
      }),
      'Order created successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      'Invalid request'
    ),
  },
});
```

---

### Service Layer

**Purpose**: Orchestrate business operations by composing domain functions and repository calls

**Responsibilities**:
- Coordinate multiple domain operations
- Manage database transactions
- Compose domain + repository operations
- Handle cross-feature interactions
- Use **wide error types** (AppResult<T>)

**Should NOT**:
- Implement business logic (delegate to domain layer)
- Build queries (delegate to repository layer)
- Declare explicit error types (use AppResult<T> default)

**Example**:

```typescript
// features/orders/services/orders.service.ts
import { AppResult, fromDB } from '@/lib/result';
import * as OrderRepo from '../repositories/orders.repository';
import * as ProductRepo from '../../products/repositories/products.repository';
import * as OrderDomain from '../domain/order-pricing.domain';
import type { AppContext } from '@/lib/db/context';

// Notice: NO explicit error types! Defaults to AppResult<T, DomainError>
export const createOrder = (
  params: CreateOrderParams,
  ctx: AppContext,
): AppResult<Order> => {
  // 1. Fetch required data
  return ProductRepo.findByIds(params.items.map(i => i.productId), ctx)
    .andThen((products) => {
      // 2. Apply domain logic
      const orderWithPricing = OrderDomain.calculateOrderTotal(
        params.items,
        products
      );

      const validated = orderWithPricing.andThen(
        OrderDomain.validateMinimumOrder
      );

      // 3. Persist in transaction
      return validated.andThen((order) =>
        fromDB(
          ctx.db.transaction(async (tx) => {
            const txCtx = { ...ctx, db: tx };
            const createdOrder = await OrderRepo.create(order, txCtx);
            await OrderRepo.createOrderItems(createdOrder.id, params.items, txCtx);
            return createdOrder;
          })
        )
      );
    });
};

export const getOrderWithDetails = (
  orderId: string,
  userId: string,
  ctx: AppContext,
): AppResult<OrderWithDetails> => {
  // Compose multiple repository calls
  return OrderRepo.findById(orderId, userId, ctx)
    .andThen((order) => {
      const items = OrderRepo.findOrderItems(orderId, ctx);
      const shipping = OrderRepo.findShippingDetails(orderId, ctx);

      // Combine multiple async operations
      return ResultAsync.combine([
        success(order),
        items,
        shipping,
      ]);
    })
    .map(([order, items, shipping]) => ({
      ...order,
      items,
      shipping,
    }));
};
```

**Key Points**:
- **No error type declarations** - they default to `DomainError`
- Compose freely without worrying about error type maintenance
- When nested functions change their error types, services don't break
- Focus on orchestration, not error management

---

### Domain Layer

**Purpose**: Implement pure business logic without infrastructure dependencies

**Responsibilities**:
- Business rule validation
- Calculations and transformations
- Entity state management
- Domain-specific logic
- Return **narrow error types**

**Should NOT**:
- Access database
- Call external APIs
- Handle HTTP concerns
- Depend on infrastructure

**Example**:

```typescript
// features/orders/domain/order-pricing.domain.ts
import { AppResult, success, failure } from '@/lib/result';
import { ValidationError } from '@/lib/errors/domain';

// Pure function: takes data, returns data
export const calculateOrderTotal = (
  items: OrderItem[],
  products: Product[],
): AppResult<OrderWithTotal, ValidationError> => {
  const productMap = new Map(products.map(p => [p.id, p]));

  let total = 0;
  const itemsWithPrices = [];

  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product) {
      return failure(
        new ValidationError(
          `Product ${item.productId} not found`,
          { productId: item.productId }
        )
      );
    }

    if (product.stock < item.quantity) {
      return failure(
        new ValidationError(
          `Insufficient stock for ${product.name}`,
          { productId: product.id, available: product.stock }
        )
      );
    }

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    itemsWithPrices.push({
      ...item,
      unitPrice: product.price,
      subtotal: itemTotal,
    });
  }

  return success({
    items: itemsWithPrices,
    subtotal: total,
    tax: total * 0.15,
    total: total * 1.15,
  });
};

export const validateMinimumOrder = (
  order: OrderWithTotal,
): AppResult<OrderWithTotal, ValidationError> => {
  const MINIMUM_ORDER = 10.00;

  if (order.total < MINIMUM_ORDER) {
    return failure(
      new ValidationError(
        `Order total must be at least ${MINIMUM_ORDER}`,
        { total: order.total, minimum: MINIMUM_ORDER }
      )
    );
  }

  return success(order);
};

export const applyDiscountCode = (
  order: OrderWithTotal,
  discountCode: string,
): AppResult<OrderWithTotal, ValidationError> => {
  const discount = VALID_DISCOUNT_CODES[discountCode];

  if (!discount) {
    return failure(
      new ValidationError('Invalid discount code', { code: discountCode })
    );
  }

  const discountAmount = order.subtotal * discount.percentage;
  const newTotal = order.total - discountAmount;

  return success({
    ...order,
    discount: discountAmount,
    total: newTotal,
  });
};
```

**Key Points**:
- **Narrow error types** - only errors this specific domain can produce
- Pure functions - easy to test without database
- No side effects
- Single responsibility per function

---

### Repository Layer

**Purpose**: Encapsulate all data access logic

**Responsibilities**:
- Query building and execution
- Data mapping (DB ↔ domain models)
- CRUD operations
- Return **narrow error types**

**Should NOT**:
- Contain business logic
- Perform calculations
- Validate business rules
- Handle transactions (services do this)

**Example**:

```typescript
// features/orders/repositories/orders.repository.ts
import { fromDB, success, failure, AppResult } from '@/lib/result';
import { NotFoundError, DatabaseError } from '@/lib/errors/domain';
import type { AppContext } from '@/lib/db/context';
import { orders } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Narrow error type - only what this function can produce
export const findById = (
  orderId: string,
  userId: string,
  ctx: AppContext,
): AppResult<Order, NotFoundError | DatabaseError> => {
  return fromDB(
    ctx.db.query.orders.findFirst({
      where: and(
        eq(orders.id, orderId),
        eq(orders.userId, userId)
      ),
    })
  ).andThen((order) =>
    order
      ? success(order)
      : failure(new NotFoundError(`Order ${orderId} not found`))
  );
};

export const findByUserId = (
  userId: string,
  ctx: AppContext,
): AppResult<Order[], DatabaseError> => {
  return fromDB(
    ctx.db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: desc(orders.createdAt),
      limit: 50,
    })
  );
};

export const create = (
  order: NewOrder,
  ctx: AppContext,
): AppResult<Order, DatabaseError> => {
  return fromDB(
    ctx.db.insert(orders)
      .values(order)
      .returning()
  ).map(([created]) => created);
};

export const update = (
  orderId: string,
  updates: Partial<Order>,
  ctx: AppContext,
): AppResult<Order, DatabaseError> => {
  return fromDB(
    ctx.db.update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning()
  ).map(([updated]) => updated);
};

// Complex query - still just data access
export const findWithItems = (
  orderId: string,
  userId: string,
  ctx: AppContext,
): AppResult<OrderWithItems, NotFoundError | DatabaseError> => {
  return fromDB(
    ctx.db.query.orders.findFirst({
      where: and(
        eq(orders.id, orderId),
        eq(orders.userId, userId)
      ),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    })
  ).andThen((order) =>
    order
      ? success(order)
      : failure(new NotFoundError(`Order ${orderId} not found`))
  );
};
```

**Key Points**:
- **Narrow error types** - explicit about what can fail
- No business logic - just data in, data out
- Type-safe queries with ORM
- Clear, single-purpose functions

---

## Error Handling Strategy

### Error Type System

```typescript
// lib/errors/base.ts
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(
    message: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

```typescript
// lib/errors/domain.ts

export class DatabaseError extends AppError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(`Database operation failed: ${message}`, metadata);
  }
}

export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(entity: string, metadata?: Record<string, unknown>) {
    super(`${entity} not found`, metadata);
  }
}

export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

export class AuthenticationError extends AppError {
  readonly code = 'AUTHENTICATION_ERROR';
  readonly statusCode = 401;
  readonly isOperational = true;
}

export class AuthorizationError extends AppError {
  readonly code = 'AUTHORIZATION_ERROR';
  readonly statusCode = 403;
  readonly isOperational = true;
}

export class EncryptionError extends AppError {
  readonly code = 'ENCRYPTION_ERROR';
  readonly statusCode = 500;
  readonly isOperational = true;
}

// Union of all domain errors
export type DomainError =
  | DatabaseError
  | NotFoundError
  | ValidationError
  | AuthenticationError
  | AuthorizationError
  | EncryptionError;
```

**Design Decisions**:

1. **Classes over discriminated unions** - Better DX with `instanceof`, natural inheritance
2. **Group by concern** - Not every failure needs its own class
3. **Include metadata** - Context for debugging and error handling
4. **Operational flag** - Distinguish expected errors from programmer errors

---

### Result Type Wrapper

```typescript
// lib/result.ts
import { ResultAsync, Result } from 'neverthrow';
import type { DomainError } from './errors/domain';
import { DatabaseError, EncryptionError } from './errors/domain';

// Default to DomainError, allow narrowing when needed
export type AppResult<T, E extends DomainError = DomainError> = ResultAsync<T, E>;
export type AppResultSync<T, E extends DomainError = DomainError> = Result<T, E>;

// Helpers for creating results
export const success = <T>(value: T): AppResult<T, never> =>
  ResultAsync.fromSafePromise(Promise.resolve(value));

export const failure = <E extends DomainError>(error: E): AppResult<never, E> =>
  ResultAsync.fromSafePromise(Promise.reject(error).catch(() => error))
    .andThen(() => ResultAsync.fromSafePromise(Promise.reject(error)));

// Domain-specific wrappers for automatic error conversion
export const fromDB = <T>(promise: Promise<T>): AppResult<T, DatabaseError> =>
  ResultAsync.fromPromise(
    promise,
    (err) => new DatabaseError(String(err))
  );

export const fromEncryption = <T>(promise: Promise<T>): AppResult<T, EncryptionError> =>
  ResultAsync.fromPromise(
    promise,
    (err) => new EncryptionError(String(err))
  );
```

---

### Error Flow Pattern

```
┌──────────────────────────────────────────────────────────────┐
│                    Error Type Flow                           │
└──────────────────────────────────────────────────────────────┘

Domain Layer
  calculatePrice(...)
    ↓ Returns: AppResult<Price, ValidationError>

Repository Layer
  findProduct(...)
    ↓ Returns: AppResult<Product, NotFoundError | DatabaseError>

Service Layer (COMPOSITION)
  createOrder(...): AppResult<Order>  ← No explicit errors!
    ↓
    Calls: findProduct() + calculatePrice()
    ↓
    Errors automatically widen to DomainError

HTTP Layer
  createOrderHandler(...)
    ↓
    Calls: createOrder()
    ↓
    Uses: handleResult() - structural error handling
    ↓
    Checks: error instanceof AppError
    ↓
    Returns: JSON with error.statusCode
```

**Key Insight**: Errors narrow at boundaries (domain/repos), widen in services, handled structurally in HTTP layer.

---

### Generic Error Handler

```typescript
// lib/http/resultHandler.ts
import type { Context } from 'hono';
import type { AppResult } from '@/lib/result';
import { AppError } from '@/lib/errors/base';

export const handleResult = async <T>(
  result: AppResult<T>,
  c: Context,
  successStatus: number = 200
) => {
  return result.match(
    (data) => c.json(data, successStatus),
    (error) => {
      // Runtime structural check (not compile-time)
      if (error instanceof AppError) {
        console.error({
          error: error.name,
          message: error.message,
          code: error.code,
          metadata: error.metadata,
          stack: error.stack,
        });

        return c.json(
          {
            error: error.name,
            message: error.message,
            code: error.code,
            ...(error.metadata && { details: error.metadata }),
          },
          error.statusCode as any
        );
      }

      // Unexpected error (programmer error)
      console.error('Unhandled error:', error);
      return c.json(
        {
          error: 'InternalServerError',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_SERVER_ERROR',
        },
        500
      );
    }
  );
};
```

---

## Complete Example

Let's build a complete feature: **Order Creation with Discount Codes**

### 1. Domain Layer (Pure Business Logic)

```typescript
// features/orders/domain/order-pricing.domain.ts
import { AppResult, success, failure } from '@/lib/result';
import { ValidationError } from '@/lib/errors/domain';

export const calculateOrderTotal = (
  items: OrderItem[],
  products: Product[],
): AppResult<OrderWithTotal, ValidationError> => {
  const productMap = new Map(products.map(p => [p.id, p]));
  let total = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return failure(new ValidationError(`Product ${item.productId} not found`));
    }
    total += product.price * item.quantity;
  }

  return success({
    items,
    subtotal: total,
    tax: total * 0.15,
    total: total * 1.15,
  });
};

export const applyDiscount = (
  order: OrderWithTotal,
  code: DiscountCode,
): AppResult<OrderWithTotal, ValidationError> => {
  if (!code.isActive) {
    return failure(new ValidationError('Discount code is inactive'));
  }

  if (code.expiresAt && code.expiresAt < new Date()) {
    return failure(new ValidationError('Discount code has expired'));
  }

  const discount = order.subtotal * code.percentage;

  return success({
    ...order,
    discount,
    total: order.total - discount,
  });
};
```

### 2. Repository Layer (Data Access)

```typescript
// features/orders/repositories/orders.repository.ts
import { fromDB, success, failure, AppResult } from '@/lib/result';
import { NotFoundError, DatabaseError } from '@/lib/errors/domain';

export const create = (
  order: NewOrder,
  ctx: AppContext,
): AppResult<Order, DatabaseError> => {
  return fromDB(
    ctx.db.insert(orders).values(order).returning()
  ).map(([created]) => created);
};

export const findDiscountCode = (
  code: string,
  ctx: AppContext,
): AppResult<DiscountCode, NotFoundError | DatabaseError> => {
  return fromDB(
    ctx.db.query.discountCodes.findFirst({
      where: eq(discountCodes.code, code),
    })
  ).andThen((discount) =>
    discount
      ? success(discount)
      : failure(new NotFoundError('Discount code'))
  );
};
```

```typescript
// features/products/repositories/products.repository.ts
export const findByIds = (
  productIds: string[],
  ctx: AppContext,
): AppResult<Product[], DatabaseError> => {
  return fromDB(
    ctx.db.query.products.findMany({
      where: inArray(products.id, productIds),
    })
  );
};
```

### 3. Service Layer (Orchestration)

```typescript
// features/orders/services/orders.service.ts
import { AppResult, fromDB } from '@/lib/result';
import * as OrderRepo from '../repositories/orders.repository';
import * as ProductRepo from '../../products/repositories/products.repository';
import * as OrderDomain from '../domain/order-pricing.domain';

// NO explicit error types!
export const createOrderWithDiscount = (
  params: CreateOrderParams,
  ctx: AppContext,
): AppResult<Order> => {
  // 1. Fetch products
  const productIds = params.items.map(i => i.productId);

  return ProductRepo.findByIds(productIds, ctx)
    .andThen((products) => {
      // 2. Calculate pricing
      const priced = OrderDomain.calculateOrderTotal(params.items, products);

      // 3. Apply discount if provided
      const withDiscount = params.discountCode
        ? priced.andThen((order) =>
            OrderRepo.findDiscountCode(params.discountCode, ctx)
              .andThen((discount) => OrderDomain.applyDiscount(order, discount))
          )
        : priced;

      // 4. Persist in transaction
      return withDiscount.andThen((finalOrder) =>
        fromDB(
          ctx.db.transaction(async (tx) => {
            const txCtx = { ...ctx, db: tx };

            const order = await OrderRepo.create({
              userId: params.userId,
              total: finalOrder.total,
              subtotal: finalOrder.subtotal,
              tax: finalOrder.tax,
              discount: finalOrder.discount,
            }, txCtx);

            // Create order items
            for (const item of params.items) {
              await OrderRepo.createOrderItem({
                orderId: order.id,
                ...item,
              }, txCtx);
            }

            // Update product stock
            for (const item of params.items) {
              await ProductRepo.decrementStock(
                item.productId,
                item.quantity,
                txCtx
              );
            }

            return order;
          })
        )
      );
    });
};
```

### 4. HTTP Layer (Request/Response)

```typescript
// features/orders/http/createOrder.handler.ts
import type { Context } from 'hono';
import { handleResult } from '@/lib/http/resultHandler';
import * as OrderService from '../services/orders.service';

export const createOrderHandler = async (c: Context) => {
  const body = await c.req.json();
  const user = c.get('user');
  const ctx = createContext();

  const result = await OrderService.createOrderWithDiscount({
    userId: user.id,
    items: body.items,
    discountCode: body.discountCode,
  }, ctx);

  return handleResult(result, c, 201);
};
```

**Flow Summary**:
1. Handler receives request → extracts data
2. Calls service → orchestrates domain + repo operations
3. Domain validates business rules (pure)
4. Repository fetches/persists data
5. Service manages transaction
6. Handler converts Result → HTTP response

**Error Handling**:
- Domain returns `ValidationError` for business rule violations
- Repository returns `NotFoundError | DatabaseError` for data issues
- Service doesn't declare errors - they widen to `DomainError`
- Handler uses structural check (`instanceof AppError`)
- All errors have proper status codes and messages

---

## Testing Strategy

### Domain Layer Tests (Pure Functions)

```typescript
// features/orders/domain/order-pricing.domain.test.ts
import { describe, it, expect } from 'vitest';
import * as OrderDomain from './order-pricing.domain';

describe('calculateOrderTotal', () => {
  it('should calculate total with tax', async () => {
    const items = [
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 1 },
    ];

    const products = [
      { id: 'p1', name: 'Widget', price: 10.00, stock: 100 },
      { id: 'p2', name: 'Gadget', price: 20.00, stock: 50 },
    ];

    const result = await OrderDomain.calculateOrderTotal(items, products);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.subtotal).toBe(40.00);
      expect(result.value.tax).toBe(6.00);
      expect(result.value.total).toBe(46.00);
    }
  });

  it('should fail when product not found', async () => {
    const items = [{ productId: 'missing', quantity: 1 }];
    const products = [];

    const result = await OrderDomain.calculateOrderTotal(items, products);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain('Product missing not found');
    }
  });
});
```

**Benefits**:
- No database required
- Fast execution
- Isolated business logic
- Easy edge case testing

---

### Repository Layer Tests (Integration)

```typescript
// features/orders/repositories/orders.repository.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import * as OrderRepo from './orders.repository';
import { createTestContext, cleanDatabase } from '@/test/helpers';

describe('OrderRepository', () => {
  let ctx: AppContext;

  beforeEach(async () => {
    ctx = createTestContext();
    await cleanDatabase(ctx.db);
  });

  it('should create order', async () => {
    const order = {
      userId: 'u123',
      total: '46.00',
      subtotal: '40.00',
      tax: '6.00',
    };

    const result = await OrderRepo.create(order, ctx);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBeDefined();
      expect(result.value.total).toBe('46.00');
    }
  });

  it('should return NotFoundError for missing order', async () => {
    const result = await OrderRepo.findById('missing', 'u123', ctx);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(NotFoundError);
    }
  });
});
```

---

### Service Layer Tests (Integration + Mocking)

```typescript
// features/orders/services/orders.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import * as OrderService from './orders.service';
import * as ProductRepo from '../../products/repositories/products.repository';
import { createTestContext } from '@/test/helpers';

describe('createOrderWithDiscount', () => {
  it('should create order with discount', async () => {
    const ctx = createTestContext();

    // Option 1: Use real database for integration test
    // Option 2: Mock repositories for unit test
    vi.spyOn(ProductRepo, 'findByIds').mockReturnValue(
      success([
        { id: 'p1', price: 10.00, stock: 100 },
      ])
    );

    const result = await OrderService.createOrderWithDiscount({
      userId: 'u123',
      items: [{ productId: 'p1', quantity: 2 }],
      discountCode: 'SAVE10',
    }, ctx);

    expect(result.isOk()).toBe(true);
  });
});
```

---

### HTTP Layer Tests (E2E)

```typescript
// features/orders/http/createOrder.handler.test.ts
import { describe, it, expect } from 'vitest';
import { app } from '@/app';

describe('POST /orders', () => {
  it('should create order', async () => {
    const response = await app.request('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        items: [
          { productId: 'p1', quantity: 2 },
        ],
      }),
    });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.total).toBeDefined();
  });

  it('should return 400 for invalid discount code', async () => {
    const response = await app.request('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        items: [{ productId: 'p1', quantity: 1 }],
        discountCode: 'INVALID',
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('ValidationError');
  });
});
```

---

## Best Practices

### ✅ DO

#### Domain Layer
- **Keep functions pure** - same inputs always produce same outputs
- **Use narrow error types** - be explicit about failure modes
- **Single responsibility** - one function, one transformation
- **Test edge cases** - no database needed, easy to test thoroughly

```typescript
// GOOD: Pure, testable, explicit errors
export const validateAge = (
  age: number
): AppResult<number, ValidationError> => {
  if (age < 18) {
    return failure(new ValidationError('Must be 18 or older'));
  }
  return success(age);
};
```

#### Repository Layer
- **One query per function** - keep functions focused
- **Use narrow error types** - `DatabaseError | NotFoundError`
- **Type-safe queries** - leverage ORM type safety
- **Consistent naming** - `findById`, `findByX`, `create`, `update`, `delete`

```typescript
// GOOD: Focused, typed, clear error handling
export const findActiveByUserId = (
  userId: string,
  ctx: AppContext
): AppResult<Order[], DatabaseError> => {
  return fromDB(
    ctx.db.query.orders.findMany({
      where: and(
        eq(orders.userId, userId),
        eq(orders.isActive, true)
      ),
    })
  );
};
```

#### Service Layer
- **Use wide error types** - `AppResult<T>` without explicit errors
- **Compose freely** - don't worry about error type maintenance
- **Manage transactions** - wrap multi-step operations
- **Coordinate features** - cross-domain logic lives here

```typescript
// GOOD: Clean composition, no error declarations
export const completeOrder = (
  orderId: string,
  ctx: AppContext
): AppResult<Order> => {
  return OrderRepo.findById(orderId, ctx)
    .andThen((order) => PaymentDomain.processPayment(order))
    .andThen((payment) => InventoryService.reserveItems(order.items, ctx))
    .andThen(() => OrderRepo.markComplete(orderId, ctx));
};
```

#### HTTP Layer
- **Use structural error handling** - `handleResult()` utility
- **Validate at boundaries** - use Zod schemas
- **Keep handlers thin** - just extract data and call service
- **Return appropriate status codes** - 201 for creates, etc.

---

### ❌ DON'T

#### Domain Layer
```typescript
// BAD: Database access in domain
export const calculateOrderTotal = async (orderId: string, ctx: AppContext) => {
  const products = await ctx.db.query.products.findMany(); // NO!
  // ...
};

// BAD: Wide error types in domain
export const validateAge = (age: number): AppResult<number> => { // Should be AppResult<number, ValidationError>
  // ...
};
```

#### Repository Layer
```typescript
// BAD: Business logic in repository
export const create = (order: Order, ctx: AppContext): AppResult<Order> => {
  if (order.total < 10) { // Business rule! Belongs in domain
    return failure(new ValidationError('Order too small'));
  }
  return fromDB(ctx.db.insert(orders).values(order).returning());
};

// BAD: Multiple unrelated queries in one function
export const getOrderData = (orderId: string, ctx: AppContext) => {
  // Fetches orders, products, users, shipping... TOO MUCH!
};
```

#### Service Layer
```typescript
// BAD: Explicit error types in service
export const createOrder = (
  params: CreateOrderParams,
  ctx: AppContext
): AppResult<Order, DatabaseError | ValidationError | NotFoundError> => { // NO! Just use AppResult<Order>
  // ...
};

// BAD: Business logic in service
export const createOrder = (...): AppResult<Order> => {
  // Direct calculation here instead of calling domain function
  const total = items.reduce((sum, item) => sum + item.price, 0); // NO!
  // Should call OrderDomain.calculateTotal(items)
};
```

#### HTTP Layer
```typescript
// BAD: Business logic in handler
export const createOrderHandler = async (c: Context) => {
  const body = await c.req.json();

  // Validation logic here - should be in domain!
  if (body.items.length === 0) {
    return c.json({ error: 'No items' }, 400);
  }

  // ...
};

// BAD: Specific error handling
export const createOrderHandler = async (c: Context) => {
  const result = await OrderService.createOrder(...);

  // Manual error checking - use handleResult() instead!
  if (result.isErr()) {
    if (result.error instanceof ValidationError) {
      return c.json({ error: result.error.message }, 400);
    }
    // ...
  }
};
```

---

## Common Patterns

### Pattern 1: Conditional Logic Flow

```typescript
// Service: Complete order with payment processing
export const completeOrderWithPayment = (
  orderId: string,
  paymentMethod: PaymentMethod,
  ctx: AppContext
): AppResult<Order> => {
  return OrderRepo.findById(orderId, ctx)
    .andThen((order) => {
      // Validate order can be completed
      const validated = OrderDomain.validateOrderComplete(order);

      // Process payment based on method
      const payment = validated.andThen(() =>
        paymentMethod === 'card'
          ? PaymentDomain.processCardPayment(order)
          : PaymentDomain.processBankTransfer(order)
      );

      // Update order status
      return payment.andThen(() =>
        OrderRepo.update(orderId, { status: 'completed' }, ctx)
      );
    });
};
```

### Pattern 2: Parallel Operations

```typescript
// Service: Get dashboard data (multiple independent queries)
export const getDashboardData = (
  userId: string,
  ctx: AppContext
): AppResult<DashboardData> => {
  // Execute queries in parallel
  const recentOrders = OrderRepo.findRecentByUserId(userId, ctx);
  const orderStats = OrderRepo.getStatsByUserId(userId, ctx);
  const recommendations = ProductRepo.getRecommendations(userId, ctx);

  // Combine results
  return ResultAsync.combine([
    recentOrders,
    orderStats,
    recommendations,
  ]).map(([orders, stats, products]) => ({
    recentOrders: orders,
    stats,
    recommendations: products,
  }));
};
```

### Pattern 3: Aggregate Building

```typescript
// Service: Build complex aggregate
export const getOrderDetails = (
  orderId: string,
  userId: string,
  ctx: AppContext
): AppResult<OrderDetails> => {
  return OrderRepo.findById(orderId, userId, ctx)
    .andThen((order) => {
      const items = OrderRepo.getOrderItems(orderId, ctx);
      const shipping = OrderRepo.getShippingDetails(orderId, ctx);
      const payment = PaymentRepo.getPaymentDetails(orderId, ctx);

      return ResultAsync.combine([
        success(order),
        items,
        shipping,
        payment,
      ]);
    })
    .map(([order, items, shipping, payment]) => ({
      ...order,
      items,
      shipping,
      payment,
      // Enrich with domain calculations
      itemCount: items.length,
      canCancel: OrderDomain.canBeCancelled(order),
      estimatedDelivery: ShippingDomain.calculateDeliveryDate(shipping),
    }));
};
```

### Pattern 4: Error Recovery

```typescript
// Service: Try operation with fallback
export const sendOrderConfirmation = (
  orderId: string,
  ctx: AppContext
): AppResult<void> => {
  return OrderRepo.findById(orderId, ctx)
    .andThen((order) =>
      // Try to send email
      EmailService.sendConfirmation(order.userEmail, order)
        .orElse((error) => {
          // Fallback: Log error and queue for retry
          console.error('Email send failed:', error);
          return QueueService.queueEmail({
            type: 'order-confirmation',
            orderId: order.id,
          }, ctx);
        })
    );
};
```

### Pattern 5: Validation Pipeline

```typescript
// Domain: Chain multiple validations
export const validateOrderForCheckout = (
  order: Order
): AppResult<Order, ValidationError> => {
  return validateHasItems(order)
    .andThen(validateMinimumTotal)
    .andThen(validateShippingAddress)
    .andThen(validatePaymentMethod);
};

const validateHasItems = (
  order: Order
): AppResult<Order, ValidationError> => {
  return order.items.length > 0
    ? success(order)
    : failure(new ValidationError('Order must have at least one item'));
};

const validateMinimumTotal = (
  order: Order
): AppResult<Order, ValidationError> => {
  return order.total >= 10
    ? success(order)
    : failure(new ValidationError('Order total must be at least $10'));
};
```

---

## Migration Guide

If you're adopting this architecture in an existing project:

### Step 1: Setup Foundation (1 day)

1. Create error class hierarchy:
   - `lib/errors/base.ts` - `AppError` base class
   - `lib/errors/domain.ts` - Domain error classes
   - `lib/errors/index.ts` - Exports

2. Create result wrapper:
   - `lib/result.ts` - `AppResult` type alias, helper functions
   - `lib/http/resultHandler.ts` - Generic error handler

### Step 2: Refactor One Feature (2-3 days)

Choose a representative feature (medium complexity) and refactor completely:

1. **Identify layers** in existing code:
   - HTTP handlers → keep as is
   - Operations → will become services
   - Actions → rename to domain
   - Queries → rename to repositories

2. **Start with domain layer**:
   - Extract pure business logic
   - Write unit tests
   - Use narrow error types

3. **Refactor repositories**:
   - Keep only data access logic
   - Use narrow error types
   - Ensure no business logic

4. **Simplify services**:
   - Remove explicit error type declarations
   - Use `AppResult<T>`
   - Focus on composition

5. **Update HTTP layer**:
   - Use `handleResult()` utility
   - Remove manual error handling

### Step 3: Document Patterns (1 day)

Create internal documentation:
- Architecture decision records (ADRs)
- Code examples for common patterns
- Testing guidelines

### Step 4: Gradual Rollout (ongoing)

- Refactor features as you touch them
- New features follow new architecture
- Eventually update remaining features

---

## FAQ

### Q: Why default to wide error types in services?

**A**: Services compose multiple operations with different error types. Explicitly listing every possible error is:
- Verbose and hard to maintain
- Creates cascading changes when nested functions change
- Doesn't provide runtime benefits (we check structurally anyway)

Wide types (`AppResult<T>`) give you flexibility without sacrificing safety.

### Q: When should I use narrow error types?

**A**: At **boundaries** where you want to be explicit about failure modes:
- Domain functions - declare what business rules can fail
- Repository functions - declare what data operations can fail
- Public APIs - be explicit about what clients might receive

### Q: Why use classes instead of discriminated unions for errors?

**A**: Classes provide:
- Better DX with `instanceof` checks
- Natural inheritance (extend `AppError`)
- Better stack traces
- Easier to add metadata
- Simpler error creation

### Q: How do I handle errors that span multiple domains?

**A**: Create a service that coordinates:

```typescript
// Service coordinates multiple domains
export const processRefund = (
  orderId: string,
  ctx: AppContext
): AppResult<Refund> => {
  return OrderRepo.findById(orderId, ctx)
    .andThen((order) => {
      // Call multiple domains
      const payment = PaymentDomain.processRefund(order);
      const inventory = InventoryDomain.restockItems(order.items);

      return ResultAsync.combine([payment, inventory]);
    })
    .andThen(([payment, _inventory]) =>
      RefundRepo.create(payment, ctx)
    );
};
```

### Q: Should transactions be in repositories or services?

**A**: **Services**. Repositories should be single-operation focused. Services orchestrate multi-step operations that need transactions:

```typescript
// GOOD: Transaction in service
export const createOrder = (params, ctx): AppResult<Order> => {
  return fromDB(
    ctx.db.transaction(async (tx) => {
      const txCtx = { ...ctx, db: tx };
      const order = await OrderRepo.create(..., txCtx);
      await OrderItemRepo.createMany(..., txCtx);
      await ProductRepo.updateStock(..., txCtx);
      return order;
    })
  );
};
```

### Q: How do I test services with many dependencies?

**A**: Two options:

1. **Integration tests** - Use real database, test full flow
2. **Mocked repositories** - Mock repository layer, test composition logic

```typescript
// Option 1: Integration test
describe('createOrder', () => {
  it('should create order', async () => {
    const ctx = createTestContext();
    const result = await OrderService.createOrder(..., ctx);
    expect(result.isOk()).toBe(true);
  });
});

// Option 2: Mocked repos
describe('createOrder', () => {
  it('should handle out of stock', async () => {
    vi.spyOn(ProductRepo, 'findByIds').mockReturnValue(
      success([{ id: 'p1', stock: 0 }])
    );

    const result = await OrderService.createOrder(..., ctx);
    expect(result.isErr()).toBe(true);
  });
});
```

---

## Summary

This architecture provides:

✅ **Clear separation of concerns** - Each layer has a single responsibility
✅ **Excellent testability** - Pure domain functions, mockable repositories
✅ **Minimal boilerplate** - Wide error types in services, structural handling in HTTP
✅ **Type safety where it matters** - Explicit at boundaries, flexible internally
✅ **Easy maintenance** - Changes are localized, not cascading
✅ **Great DX** - Write business logic, not error type gymnastics

### Key Takeaways

1. **Domain layer** = Pure business logic, narrow errors, unit tested
2. **Repository layer** = Data access only, narrow errors, integration tested
3. **Service layer** = Orchestration, wide errors (`AppResult<T>`), composition focused
4. **HTTP layer** = Request/response, structural error handling, thin

### The Pattern in One Diagram

```
HTTP:        AppResult<T> → handleResult() → JSON response
                ↑
Service:     AppResult<T> (wide, no explicit errors)
                ↑
          ┌─────┴─────┐
Domain:   ↑           ↑      Repository:
      AppResult<T, E> | AppResult<T, E>
      (narrow errors) | (narrow errors)
```

**Remember**: Narrow at boundaries, wide internally, structural at edges.

---

*For questions or clarifications about this architecture, please reach out to the team lead or open a discussion in the team channel.*
