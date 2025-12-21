import { and, desc, asc, SQL, AnyColumn } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { SearchQueries } from "../http/types";

const DEFAULT_SORT_ORDER = "asc" as const;

/**
 * Builds a Drizzle ORM query from search parameters with filtering, sorting, and pagination.
 *
 * @template TEntity - The entity type being queried
 * @template TFilters - The filter parameters type
 * @template T - The Drizzle PgSelect query builder type
 *
 * @param qb - The initial Drizzle query builder (e.g., db.select().from(table))
 * @param query - Search parameters including filters, sort, order, limit, and offset
 * @param filterMap - Map of filter keys to SQL condition builder functions
 * @param sortColumns - Optional map of sort keys to table columns for ordering
 *
 * @returns Modified query builder with applied filters, sorting, and pagination
 *
 * @example
 * ```typescript
 * const query = buildDrizzleQuery(
 *   db.select().from(users),
 *   { status: 'active', limit: 10, sort: 'createdAt', order: 'desc' },
 *   { status: (val) => eq(users.status, val) },
 *   { createdAt: users.createdAt }
 * );
 * ```
 */
function buildDrizzleQuery<
  TEntity,
  TFilters extends Record<string, unknown>,
  T extends PgSelect,
>(
  qb: T,
  query: SearchQueries<TEntity, TFilters>,
  filterMap: {
    [K in keyof TFilters]: (value: TFilters[K]) => SQL;
  },
  sortColumns?: Record<string, AnyColumn>,
): T {
  const conditions = (
    Object.entries(filterMap) as Array<
      [keyof TFilters, (value: TFilters[keyof TFilters]) => SQL]
    >
  )
    .filter(([key]) => {
      const filterKey = key as keyof TFilters;
      return query[filterKey] !== undefined;
    })
    .map(([key, builder]) => {
      const filterKey = key as keyof TFilters;
      const value = query[filterKey];
      return builder(value as TFilters[keyof TFilters]);
    });

  const withFilters = conditions.length > 0 ? qb.where(and(...conditions)) : qb;

  const withSort =
    query.sort && sortColumns
      ? (() => {
          const sortColumn = sortColumns[query.sort];
          if (!sortColumn) {
            console.warn(
              `Sort key "${query.sort}" not found in sortColumns mapping`,
            );
            return withFilters;
          }
          const sortOrder = query.order ?? DEFAULT_SORT_ORDER;
          return withFilters.orderBy(
            sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn),
          );
        })()
      : withFilters;

  const withLimit =
    query.limit !== undefined && query.limit > 0
      ? withSort.limit(query.limit)
      : withSort;

  const withOffset =
    query.offset !== undefined && query.offset >= 0
      ? withLimit.offset(query.offset)
      : withLimit;

  // Type assertion needed because TypeScript can't track the builder's
  // fluent interface through the functional composition chain.
  // This is safe because PgSelect methods always return PgSelect.
  return withOffset as T;
}

export default buildDrizzleQuery;
