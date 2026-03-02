# Backend Architecture Design

## Overview

A four-layer architecture designed for maintainability, testability, and minimal boilerplate.

```
┌─────────────────────────────────────┐
│          HTTP LAYER                 │
│  Request/Response handling          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        SERVICE LAYER                │
│  Orchestration & Composition        │
└─────────────────────────────────────┘
              ↓
      ┌───────┴────────┐
      ↓                ↓
┌─────────────┐  ┌─────────────┐
│   DOMAIN    │  │ REPOSITORY  │
│   LAYER     │  │   LAYER     │
│ Business    │  │ Data Access │
│  Logic      │  │             │
└─────────────┘  └─────────────┘
```

## Layer Responsibilities

**HTTP Layer**
Handles HTTP concerns: routing, request parsing, response serialization, authentication. Delegates all logic to services.

**Service Layer**
Orchestrates workflows by composing domain functions and repository calls. Manages database transactions. Coordinates cross-feature operations.

**Domain Layer**
Pure business logic: calculations, validations, transformations. No database access, no side effects. Highly testable in isolation.

**Repository Layer**
All database access. Builds queries, maps data, handles CRUD operations. No business logic.

## Error Handling Strategy

```
Error Flow:

Domain:      Specific errors (ValidationError)
Repository:  Specific errors (NotFoundError, DatabaseError)
             ↓
Service:     Generic errors (accepts any DomainError)
             ↓
HTTP:        Structural handling (runtime checks)
```

**Narrow at Boundaries:** Domain and Repository declare specific error types.

**Wide Internally:** Services use generic error types to avoid maintenance burden.

**Structural at Edges:** HTTP layer checks error types at runtime, not compile-time.

## Design Benefits

**Separation of Concerns:** Each layer has one clear responsibility.

**Testability:** Domain functions are pure—test without infrastructure.

**Maintainability:** Changes localized to one layer. Services don't break when nested function errors change.

**Developer Experience:** Minimal type declarations, clear error messages, fast iteration.

## Key Principle

Dependencies flow inward: HTTP → Service → Domain/Repository. Inner layers never depend on outer layers.
