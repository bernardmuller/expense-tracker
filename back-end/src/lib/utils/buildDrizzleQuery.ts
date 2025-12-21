import { and, desc, asc, SQL, AnyColumn } from "drizzle-orm";
import { SearchQueries } from "../http/types";

const DEFAULT_SORT_ORDER = "asc" as const;

/**
 * Builds a Drizzle ORM query from search parameters with filtering, sorting, and pagination.
 *
 * @template TEntity - The entity type being queried
 * @template TFilters - The filter parameters type
 * @template TQueryBuilder - The Drizzle query builder type (must be PromiseLike and have query methods)
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
  TQueryBuilder extends PromiseLike<any> & {
    where: (condition: SQL | undefined) => any;
    orderBy: (...columns: SQL[]) => any;
    limit: (count: number) => any;
    offset: (count: number) => any;
  },
>(
  qb: TQueryBuilder,
  query: SearchQueries<TEntity, TFilters>,
  filterMap: {
    [K in keyof TFilters]: (value: TFilters[K]) => SQL;
  },
  sortColumns?: Record<string, AnyColumn>,
): TQueryBuilder {
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

  let queryBuilder = qb;

  if (conditions.length > 0) {
    queryBuilder = queryBuilder.where(and(...conditions)) as TQueryBuilder;
  }

  if (query.sort && sortColumns) {
    const sortColumn = sortColumns[query.sort];
    if (!sortColumn) {
      console.warn(`Sort key "${query.sort}" not found in sortColumns mapping`);
    } else {
      const sortOrder = query.order ?? DEFAULT_SORT_ORDER;
      queryBuilder = queryBuilder.orderBy(
        sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn),
      ) as TQueryBuilder;
    }
  }

  if (query.limit !== undefined && query.limit > 0) {
    queryBuilder = queryBuilder.limit(query.limit) as TQueryBuilder;
  }

  if (query.offset !== undefined && query.offset >= 0) {
    queryBuilder = queryBuilder.offset(query.offset) as TQueryBuilder;
  }

  return queryBuilder;
}

export default buildDrizzleQuery;
