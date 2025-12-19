import { and, desc, asc, SQL, AnyColumn } from "drizzle-orm";
import { SearchQueries } from "../http/types";
import coerceUnknown from "./coerceUnknown";

interface DrizzleQueryBuilder<TResult = unknown> extends PromiseLike<TResult> {
  where: (condition: SQL | undefined) => unknown;
  orderBy: (...columns: SQL[]) => unknown;
  limit: (count: number) => unknown;
  offset: (count: number) => unknown;
}

function buildDrizzleQuery<
  TEntity,
  TFilters extends Record<string, unknown>,
  TResult,
  TQueryBuilder extends DrizzleQueryBuilder<TResult>,
>(
  qb: TQueryBuilder,
  query: SearchQueries<TEntity, TFilters>,
  filterMap: {
    [K in keyof TFilters]: (value: TFilters[K]) => SQL;
  },
  sortColumns?: Record<string, AnyColumn>,
  typeCoercions?: {
    [K in keyof TFilters]?: (value: unknown) => TFilters[K];
  },
): TQueryBuilder {
  let queryBuilder = qb;

  const getCoercedValue = (key: string): unknown => {
    const value = (query as Record<string, unknown>)[key];
    if (value === undefined) return undefined;

    if (typeCoercions && key in typeCoercions) {
      const coercer = typeCoercions[key as keyof TFilters];
      return coercer ? coercer(value) : value;
    }

    return coerceUnknown(value);
  };

  const conditions = (
    Object.entries(filterMap) as Array<
      [keyof TFilters, (value: TFilters[keyof TFilters]) => SQL]
    >
  )
    .filter(
      ([key]) =>
        (query as Record<string, unknown>)[key as string] !== undefined,
    )
    .map(([key, builder]) => {
      const value = getCoercedValue(key as string);
      return builder(value as TFilters[keyof TFilters]);
    });

  if (conditions.length > 0) {
    queryBuilder = queryBuilder.where(and(...conditions)) as TQueryBuilder;
  }

  if (query.sort && sortColumns && query.sort in sortColumns) {
    const sortColumn = sortColumns[query.sort as string];
    if (sortColumn) {
      queryBuilder = queryBuilder.orderBy(
        query.order === "desc" ? desc(sortColumn) : asc(sortColumn),
      ) as TQueryBuilder;
    }
  }

  if (query.limit !== undefined) {
    const limit = coerceUnknown(query.limit) as number;
    queryBuilder = queryBuilder.limit(limit) as TQueryBuilder;
  }

  if (query.offset !== undefined) {
    const offset = coerceUnknown(query.offset) as number;
    queryBuilder = queryBuilder.offset(offset) as TQueryBuilder;
  }

  return queryBuilder;
}

export default buildDrizzleQuery;
