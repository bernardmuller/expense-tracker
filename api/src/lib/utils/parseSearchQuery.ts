import { Result, ok, err } from "neverthrow";
import { SearchQueries } from "../http/types";
import coerceUnknown from "./coerceUnknown";
import { ValidationError } from "../errors/domain";

type RawQueryParams = Record<string, string | string[] | undefined>;

const SORT_ORDERS = ["asc", "desc"] as const;
type SortOrder = (typeof SORT_ORDERS)[number];

const RESERVED_QUERY_PARAMS = [
  "limit",
  "offset",
  "sort",
  "order",
  "include",
] as const;

interface ParseSearchQueryOptions<
  TEntity,
  TFilters extends Record<string, unknown>,
> {
  rawQuery: RawQueryParams;
  allowedSortKeys?: Array<keyof TEntity & string>;
  filterKeys?: Array<keyof TFilters & string>;
  maxLimit?: number;
  allowArrayFilters?: boolean;
  allowedIncludes?: string[];
}

function validateNotArray(
  paramName: string,
  value: string | string[] | undefined,
): Result<string | undefined, ValidationError> {
  if (Array.isArray(value)) {
    return err(new ValidationError(`${paramName} parameter cannot be an array`));
  }
  return ok(value);
}

function parseNumericParam(
  paramName: string,
  rawValue: string | string[] | undefined,
  validator?: (value: number) => string | null,
): Result<number, ValidationError> {
  const notArrayResult = validateNotArray(paramName, rawValue);
  if (notArrayResult.isErr()) {
    return err(notArrayResult.error);
  }

  const coerceResult = coerceUnknown(rawValue);
  if (coerceResult.isErr()) {
    return err(coerceResult.error);
  }

  const value = coerceResult.value;
  if (typeof value !== "number") {
    return err(new ValidationError(`${paramName} must be a number`));
  }

  if (validator) {
    const validationError = validator(value);
    if (validationError) {
      return err(new ValidationError(validationError));
    }
  }

  return ok(value);
}

function parseLimitParam(
  rawValue: string | string[] | undefined,
  maxLimit: number,
): Result<number, ValidationError> {
  return parseNumericParam("limit", rawValue, (num) => {
    if (num <= 0 || num > maxLimit) {
      return `limit must be between 1 and ${maxLimit}`;
    }
    return null;
  });
}

function parseOffsetParam(
  rawValue: string | string[] | undefined,
): Result<number, ValidationError> {
  return parseNumericParam("offset", rawValue, (num) => {
    if (num < 0) {
      return "offset must be non-negative";
    }
    return null;
  });
}

function parseSortParam<TEntity>(
  rawValue: string | string[] | undefined,
  allowedSortKeys?: Array<keyof TEntity & string>,
): Result<keyof TEntity & string, ValidationError> {
  const notArrayResult = validateNotArray("sort", rawValue);
  if (notArrayResult.isErr()) {
    return err(notArrayResult.error);
  }

  if (typeof rawValue !== "string") {
    return err(new ValidationError("sort must be a string"));
  }

  if (
    allowedSortKeys &&
    !allowedSortKeys.includes(rawValue as keyof TEntity & string)
  ) {
    return err(
      new ValidationError(`sort must be one of: ${allowedSortKeys.join(", ")}`),
    );
  }

  return ok(rawValue as keyof TEntity & string);
}

function parseOrderParam(
  rawValue: string | string[] | undefined,
): Result<SortOrder, ValidationError> {
  const notArrayResult = validateNotArray("order", rawValue);
  if (notArrayResult.isErr()) {
    return err(notArrayResult.error);
  }

  if (typeof rawValue !== "string") {
    return err(new ValidationError("order must be a string"));
  }

  if (!SORT_ORDERS.includes(rawValue as SortOrder)) {
    return err(
      new ValidationError(`order must be one of: ${SORT_ORDERS.join(", ")}`),
    );
  }

  return ok(rawValue as SortOrder);
}

function parseIncludeParam(
  rawValue: string | string[] | undefined,
  allowedIncludes?: string[],
): Result<string[], ValidationError> {
  if (rawValue === undefined) {
    return ok([]);
  }

  const includeArray = Array.isArray(rawValue) ? rawValue : [rawValue];

  for (const includeValue of includeArray) {
    if (typeof includeValue !== "string") {
      return err(new ValidationError("include values must be strings"));
    }

    if (allowedIncludes && !allowedIncludes.includes(includeValue)) {
      return err(
        new ValidationError(
          `include value '${includeValue}' is not allowed. Allowed values: ${allowedIncludes.join(", ")}`,
        ),
      );
    }
  }

  return ok(includeArray);
}

/**
 * Parses and validates search query parameters from raw query strings.
 * Handles pagination (limit/offset), sorting (sort/order), and custom filter parameters.
 *
 * @template TEntity - The entity type being queried (used for sort key validation)
 * @template TFilters - Additional filter parameters beyond base query options
 * @param options - Configuration options for parsing
 * @returns Result containing validated SearchQueries or CoercionError if validation fails
 *
 * Edge case behaviors:
 * - Empty rawQuery returns an empty object (valid)
 * - If 'order' is provided without 'sort', returns an error
 * - Filter keys that overlap with reserved params (limit/offset/sort/order) will cause an error
 *
 * @example
 * ```typescript
 * const result = parseSearchQuery({
 *   rawQuery: { limit: "10", offset: "0", sort: "createdAt", order: "desc" },
 *   allowedSortKeys: ["id", "createdAt", "name"],
 *   filterKeys: ["status", "category"],
 *   maxLimit: 100
 * });
 * ```
 */
export function parseSearchQuery<
  TEntity,
  TFilters extends Record<string, unknown> = Record<string, unknown>,
>(
  options: ParseSearchQueryOptions<TEntity, TFilters>,
): Result<
  SearchQueries<TEntity, TFilters>,
  ValidationError
> {
  const {
    rawQuery,
    allowedSortKeys,
    filterKeys,
    maxLimit = 1000,
    allowArrayFilters = false,
    allowedIncludes,
  } = options;

  if (filterKeys) {
    for (const filterKey of filterKeys) {
      if (RESERVED_QUERY_PARAMS.includes(filterKey as any)) {
        return err(
          new ValidationError(
            `Filter key '${filterKey}' conflicts with reserved parameter. Reserved params: ${RESERVED_QUERY_PARAMS.join(", ")}`,
          ),
        );
      }
    }
  }

  let limit: number | undefined;
  let offset: number | undefined;
  let sort: (keyof TEntity & string) | undefined;
  let order: SortOrder | undefined;
  let include: string[] | undefined;

  if (rawQuery.limit !== undefined) {
    const limitResult = parseLimitParam(rawQuery.limit, maxLimit);
    if (limitResult.isErr()) {
      return err(limitResult.error);
    }
    limit = limitResult.value;
  }

  if (rawQuery.offset !== undefined) {
    const offsetResult = parseOffsetParam(rawQuery.offset);
    if (offsetResult.isErr()) {
      return err(offsetResult.error);
    }
    offset = offsetResult.value;
  }

  if (rawQuery.sort !== undefined) {
    const sortResult = parseSortParam<TEntity>(rawQuery.sort, allowedSortKeys);
    if (sortResult.isErr()) {
      return err(sortResult.error);
    }
    sort = sortResult.value;
  }

  if (rawQuery.order !== undefined) {
    const orderResult = parseOrderParam(rawQuery.order);
    if (orderResult.isErr()) {
      return err(orderResult.error);
    }
    order = orderResult.value;
  }

  if (order !== undefined && sort === undefined) {
    return err(
      new ValidationError(
        "order parameter requires sort to be specified. Provide a sort key when using order.",
      ),
    );
  }

  if (rawQuery.include !== undefined) {
    const includeResult = parseIncludeParam(rawQuery.include, allowedIncludes);
    if (includeResult.isErr()) {
      return err(includeResult.error);
    }
    include = includeResult.value.length > 0 ? includeResult.value : undefined;
  }

  const baseParams: {
    limit?: number;
    offset?: number;
    sort?: keyof TEntity & string;
    order?: SortOrder;
    include?: string[];
  } = {};

  if (limit !== undefined) baseParams.limit = limit;
  if (offset !== undefined) baseParams.offset = offset;
  if (sort !== undefined) baseParams.sort = sort;
  if (order !== undefined) baseParams.order = order;
  if (include !== undefined) baseParams.include = include;

  const filterParams: Record<string, unknown> = {};

  if (filterKeys) {
    for (const key of filterKeys) {
      const rawValue = rawQuery[key];

      if (rawValue === undefined) {
        continue;
      }

      if (Array.isArray(rawValue) && !allowArrayFilters) {
        return err(
          new ValidationError(
            `Filter parameter '${key}' cannot be an array. To allow array filters, set allowArrayFilters: true`,
          ),
        );
      }

      if (Array.isArray(rawValue)) {
        const coercedArray: (string | boolean | number)[] = [];
        for (const item of rawValue) {
          const coercedResult = coerceUnknown(item);
          if (coercedResult.isErr()) {
            return err(
              new ValidationError(
                `Failed to parse filter '${key}' array element: ${coercedResult.error.message}`,
              ),
            );
          }
          coercedArray.push(coercedResult.value);
        }
        filterParams[key] = coercedArray;
      } else {
        const coercedResult = coerceUnknown(rawValue);
        if (coercedResult.isErr()) {
          return err(
            new ValidationError(
              `Failed to parse filter '${key}': ${coercedResult.error.message}`,
            ),
          );
        }
        filterParams[key] = coercedResult.value;
      }
    }
  }

  const result: SearchQueries<TEntity, TFilters> = {
    ...baseParams,
    ...filterParams,
  } as SearchQueries<TEntity, TFilters>;

  return ok(result);
}
