import { describe, it, expect } from "vitest";
import { parseSearchQuery } from "./parseSearchQuery";

describe("parseSearchQuery", () => {
  // ============================================
  // Basic Happy Paths
  // ============================================

  it("should return empty object for empty rawQuery", () => {
    const result = parseSearchQuery({
      rawQuery: {},
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({});
    }
  });

  it("should parse valid limit", () => {
    const result = parseSearchQuery({
      rawQuery: { limit: "10" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.limit).toBe(10);
    }
  });

  it("should parse valid offset", () => {
    const result = parseSearchQuery({
      rawQuery: { offset: "20" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.offset).toBe(20);
    }
  });

  it("should parse valid sort and order together", () => {
    const result = parseSearchQuery<{ createdAt: Date }>({
      rawQuery: { sort: "createdAt", order: "desc" },
      allowedSortKeys: ["createdAt"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.sort).toBe("createdAt");
      expect(result.value.order).toBe("desc");
    }
  });

  it("should parse single filter parameter", () => {
    const result = parseSearchQuery<unknown, { status: string }>({
      rawQuery: { status: "active" },
      filterKeys: ["status"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.status).toBe("active");
    }
  });

  it("should parse complete query with all parameters", () => {
    const result = parseSearchQuery<
      { createdAt: Date; name: string },
      { status: string; category: string }
    >({
      rawQuery: {
        limit: "25",
        offset: "0",
        sort: "createdAt",
        order: "desc",
        status: "active",
        category: "electronics",
      },
      allowedSortKeys: ["createdAt", "name"],
      filterKeys: ["status", "category"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({
        limit: 25,
        offset: 0,
        sort: "createdAt",
        order: "desc",
        status: "active",
        category: "electronics",
      });
    }
  });

  // ============================================
  // Limit Parameter
  // ============================================

  it("should accept limit = 1 (minimum valid)", () => {
    const result = parseSearchQuery({
      rawQuery: { limit: "1" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.limit).toBe(1);
    }
  });

  it("should accept limit = maxLimit (maximum valid)", () => {
    const result = parseSearchQuery({
      rawQuery: { limit: "50" },
      maxLimit: 50,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.limit).toBe(50);
    }
  });

  it("should reject limit = 0", () => {
    const result = parseSearchQuery({
      rawQuery: { limit: "0" },
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("limit must be between 1 and");
    }
  });

  it("should reject limit > maxLimit", () => {
    const result = parseSearchQuery({
      rawQuery: { limit: "101" },
      maxLimit: 100,
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("limit must be between 1 and 100");
    }
  });

  it("should reject limit as array", () => {
    const result = parseSearchQuery({
      rawQuery: { limit: ["10", "20"] },
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("cannot be an array");
    }
  });

  // ============================================
  // Offset Parameter
  // ============================================

  it("should accept offset = 0", () => {
    const result = parseSearchQuery({
      rawQuery: { offset: "0" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.offset).toBe(0);
    }
  });

  it("should reject negative offset", () => {
    const result = parseSearchQuery({
      rawQuery: { offset: "-1" },
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("offset must be non-negative");
    }
  });

  it("should reject offset as array", () => {
    const result = parseSearchQuery({
      rawQuery: { offset: ["0", "10"] },
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("cannot be an array");
    }
  });

  // ============================================
  // Sort Parameter
  // ============================================

  it("should accept valid sort key from allowedSortKeys", () => {
    const result = parseSearchQuery<{ id: number; name: string }>({
      rawQuery: { sort: "name" },
      allowedSortKeys: ["id", "name"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.sort).toBe("name");
    }
  });

  it("should reject sort key not in allowedSortKeys", () => {
    const result = parseSearchQuery<{ id: number; name: string }>({
      rawQuery: { sort: "email" },
      allowedSortKeys: ["id", "name"],
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("sort must be one of: id, name");
    }
  });

  it("should accept any sort key when allowedSortKeys is undefined", () => {
    const result = parseSearchQuery({
      rawQuery: { sort: "anyField" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.sort).toBe("anyField");
    }
  });

  it("should reject sort as array", () => {
    const result = parseSearchQuery({
      rawQuery: { sort: ["name", "id"] },
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("cannot be an array");
    }
  });

  // ============================================
  // Order Parameter
  // ============================================

  it("should accept order = 'asc'", () => {
    const result = parseSearchQuery({
      rawQuery: { sort: "name", order: "asc" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.order).toBe("asc");
    }
  });

  it("should accept order = 'desc'", () => {
    const result = parseSearchQuery({
      rawQuery: { sort: "name", order: "desc" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.order).toBe("desc");
    }
  });

  it("should reject invalid order value", () => {
    const result = parseSearchQuery({
      rawQuery: { sort: "name", order: "ascending" },
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("order must be one of: asc, desc");
    }
  });

  // ============================================
  // Sort/Order Relationship
  // ============================================

  it("should reject order without sort", () => {
    const result = parseSearchQuery({
      rawQuery: { order: "desc" },
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain(
        "order parameter requires sort to be specified",
      );
    }
  });

  it("should accept sort without order", () => {
    const result = parseSearchQuery({
      rawQuery: { sort: "name" },
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.sort).toBe("name");
      expect(result.value.order).toBeUndefined();
    }
  });

  // ============================================
  // Filter Parameters
  // ============================================

  it("should parse multiple filter parameters", () => {
    const result = parseSearchQuery<
      unknown,
      { status: string; category: string; inStock: boolean }
    >({
      rawQuery: { status: "active", category: "books", inStock: "true" },
      filterKeys: ["status", "category", "inStock"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.status).toBe("active");
      expect(result.value.category).toBe("books");
      expect(result.value.inStock).toBe(true);
    }
  });

  it("should ignore filter parameters not in filterKeys", () => {
    const result = parseSearchQuery<unknown, { status: string }>({
      rawQuery: { status: "active", unknownParam: "value" },
      filterKeys: ["status"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.status).toBe("active");
      expect("unknownParam" in result.value).toBe(false);
    }
  });

  it("should skip undefined filter values", () => {
    const result = parseSearchQuery<unknown, { status: string }>({
      rawQuery: { status: undefined },
      filterKeys: ["status"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect("status" in result.value).toBe(false);
    }
  });

  it("should reject array filter when allowArrayFilters = false", () => {
    const result = parseSearchQuery<unknown, { tags: string[] }>({
      rawQuery: { tags: ["tag1", "tag2"] },
      filterKeys: ["tags"],
      allowArrayFilters: false,
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain(
        "Filter parameter 'tags' cannot be an array",
      );
    }
  });

  it("should accept array filter when allowArrayFilters = true", () => {
    const result = parseSearchQuery<unknown, { tags: string[] }>({
      rawQuery: { tags: ["tag1", "tag2"] },
      filterKeys: ["tags"],
      allowArrayFilters: true,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.tags).toEqual(["tag1", "tag2"]);
    }
  });

  // ============================================
  // Reserved Parameters & Conflicts
  // ============================================

  it("should reject filterKey that conflicts with reserved params", () => {
    const resultLimit = parseSearchQuery({
      rawQuery: {},
      filterKeys: ["limit"],
    });

    expect(resultLimit.isErr()).toBe(true);
    if (resultLimit.isErr()) {
      expect(resultLimit.error.message).toContain(
        "Filter key 'limit' conflicts with reserved parameter",
      );
    }

    const resultOffset = parseSearchQuery({
      rawQuery: {},
      filterKeys: ["offset"],
    });

    expect(resultOffset.isErr()).toBe(true);

    const resultSort = parseSearchQuery({
      rawQuery: {},
      filterKeys: ["sort"],
    });

    expect(resultSort.isErr()).toBe(true);

    const resultOrder = parseSearchQuery({
      rawQuery: {},
      filterKeys: ["order"],
    });

    expect(resultOrder.isErr()).toBe(true);
  });

  // ============================================
  // Type Coercion & Validation
  // ============================================

  it("should coerce filter values correctly via coerceUnknown", () => {
    const result = parseSearchQuery<
      unknown,
      { count: number; active: boolean; name: string }
    >({
      rawQuery: {
        count: "42",
        active: "true",
        name: "test",
      },
      filterKeys: ["count", "active", "name"],
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.count).toBe(42);
      expect(result.value.active).toBe(true);
      expect(result.value.name).toBe("test");
    }
  });
});
