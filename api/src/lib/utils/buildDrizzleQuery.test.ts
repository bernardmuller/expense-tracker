import { describe, it, expect, vi, beforeEach } from "vitest";
import { and, desc, asc, SQL, AnyColumn } from "drizzle-orm";
import buildDrizzleQuery from "./buildDrizzleQuery";
import type { PgSelect } from "drizzle-orm/pg-core";

// Mock Drizzle ORM functions
vi.mock("drizzle-orm", async () => {
  const actual = await vi.importActual("drizzle-orm");
  return {
    ...actual,
    and: vi.fn((...conditions) => ({
      _type: "and",
      conditions,
    })),
    desc: vi.fn((column) => ({ _type: "desc", column })),
    asc: vi.fn((column) => ({ _type: "asc", column })),
  };
});

// Helper to create a mock query builder
function createMockQueryBuilder() {
  const mockQb = {
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
  };
  return mockQb as unknown as PgSelect;
}

// Mock column objects
const mockColumns = {
  id: { name: "id" },
  createdAt: { name: "createdAt" },
  updatedAt: { name: "updatedAt" },
  name: { name: "name" },
};

// Mock table objects for relation testing
const mockCategoriesTable = { name: "categories" };
const mockBudgetsTable = { name: "budgets" };

// Mock relation configurations
const mockRelationMap = {
  category: {
    table: mockCategoriesTable,
    on: { _type: "eq", left: "categoryId", right: "id" } as unknown as SQL,
    fields: {
      id: { name: "category.id" },
      name: { name: "category.name" },
    },
  },
  budget: {
    table: mockBudgetsTable,
    on: { _type: "eq", left: "budgetId", right: "id" } as unknown as SQL,
    fields: {
      id: { name: "budget.id" },
      name: { name: "budget.name" },
    },
  },
};

describe("buildDrizzleQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Filter Application Tests
  // ============================================

  describe("Filter Application", () => {
    it("should return unmodified query when no filters provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {};

      const result = buildDrizzleQuery(mockQb, {}, filterMap);

      expect(mockQb.where).not.toHaveBeenCalled();
      expect(result).toBe(mockQb);
    });

    it("should apply single filter condition", () => {
      const mockQb = createMockQueryBuilder();
      const mockSql = { _type: "sql" } as unknown as SQL;
      const filterMap = {
        status: vi.fn().mockReturnValue(mockSql),
      };

      buildDrizzleQuery(
        mockQb,
        { status: "active" },
        filterMap,
      );

      expect(filterMap.status).toHaveBeenCalledWith("active");
      expect(mockQb.where).toHaveBeenCalledWith({
        _type: "and",
        conditions: [mockSql],
      });
    });

    it("should apply multiple filter conditions with and()", () => {
      const mockQb = createMockQueryBuilder();
      const mockSql1 = { _type: "sql1" } as unknown as SQL;
      const mockSql2 = { _type: "sql2" } as unknown as SQL;
      const filterMap = {
        status: vi.fn().mockReturnValue(mockSql1),
        category: vi.fn().mockReturnValue(mockSql2),
      };

      buildDrizzleQuery(
        mockQb,
        { status: "active", category: "electronics" },
        filterMap,
      );

      expect(filterMap.status).toHaveBeenCalledWith("active");
      expect(filterMap.category).toHaveBeenCalledWith("electronics");
      expect(and).toHaveBeenCalledWith(mockSql1, mockSql2);
      expect(mockQb.where).toHaveBeenCalled();
    });

    it("should ignore undefined filter values", () => {
      const mockQb = createMockQueryBuilder();
      const mockSql = { _type: "sql" } as unknown as SQL;
      const filterMap = {
        status: vi.fn().mockReturnValue(mockSql),
        category: vi.fn(),
      };

      buildDrizzleQuery(
        mockQb,
        { status: "active", category: undefined },
        filterMap,
      );

      expect(filterMap.status).toHaveBeenCalledWith("active");
      expect(filterMap.category).not.toHaveBeenCalled();
      expect(mockQb.where).toHaveBeenCalledWith({
        _type: "and",
        conditions: [mockSql],
      });
    });

    it("should ignore filters not in filterMap", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {
        status: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
      };

      buildDrizzleQuery(
        mockQb,
        { status: "active", unknownFilter: "value" } as any,
        filterMap,
      );

      expect(filterMap.status).toHaveBeenCalledWith("active");
      expect(mockQb.where).toHaveBeenCalled();
    });

    it("should handle null filter values", () => {
      const mockQb = createMockQueryBuilder();
      const mockSql = { _type: "sql" } as unknown as SQL;
      const filterMap = {
        status: vi.fn().mockReturnValue(mockSql),
      };

      buildDrizzleQuery(
        mockQb,
        { status: null },
        filterMap,
      );

      expect(filterMap.status).toHaveBeenCalledWith(null);
      expect(mockQb.where).toHaveBeenCalled();
    });

    it("should handle different data types in filters", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {
        count: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
        active: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
        tags: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
      };

      buildDrizzleQuery(
        mockQb,
        { count: 42, active: true, tags: ["tag1", "tag2"] },
        filterMap,
      );

      expect(filterMap.count).toHaveBeenCalledWith(42);
      expect(filterMap.active).toHaveBeenCalledWith(true);
      expect(filterMap.tags).toHaveBeenCalledWith(["tag1", "tag2"]);
    });
  });

  // ============================================
  // Sorting Tests
  // ============================================

  describe("Sorting", () => {
    it("should not apply sorting when sort is not provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {};

      buildDrizzleQuery(mockQb, {}, filterMap, mockColumns as unknown as Record<string, AnyColumn>);

      expect(mockQb.orderBy).not.toHaveBeenCalled();
    });

    it("should apply ascending sort by default", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { sort: "createdAt" },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      expect(asc).toHaveBeenCalledWith(mockColumns.createdAt);
      expect(mockQb.orderBy).toHaveBeenCalledWith({
        _type: "asc",
        column: mockColumns.createdAt,
      });
    });

    it("should apply ascending sort when order is 'asc'", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { sort: "createdAt", order: "asc" },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      expect(asc).toHaveBeenCalledWith(mockColumns.createdAt);
      expect(mockQb.orderBy).toHaveBeenCalled();
    });

    it("should apply descending sort when order is 'desc'", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { sort: "createdAt", order: "desc" },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      expect(desc).toHaveBeenCalledWith(mockColumns.createdAt);
      expect(mockQb.orderBy).toHaveBeenCalledWith({
        _type: "desc",
        column: mockColumns.createdAt,
      });
    });

    it("should warn and skip sorting for invalid sort key", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      buildDrizzleQuery(
        mockQb,
        { sort: "invalidColumn" },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Sort key "invalidColumn" not found in sortColumns mapping',
      );
      expect(mockQb.orderBy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should not apply sorting when sortColumns is not provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { sort: "createdAt", order: "desc" },
        filterMap,
      );

      expect(mockQb.orderBy).not.toHaveBeenCalled();
    });

    it("should not apply sorting when sortColumns is empty", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { sort: "createdAt" },
        filterMap,
        {},
      );

      expect(mockQb.orderBy).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Relation Joins/Includes Tests
  // ============================================

  describe("Relation Joins/Includes", () => {
    it("should not apply joins when include is not provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {};

      buildDrizzleQuery(mockQb, {}, filterMap, mockColumns as unknown as Record<string, AnyColumn>, mockRelationMap as any);

      expect(mockQb.leftJoin).not.toHaveBeenCalled();
    });

    it("should not apply joins when include array is empty", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { include: [] },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      expect(mockQb.leftJoin).not.toHaveBeenCalled();
    });

    it("should not apply joins when relationMap is not provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { include: ["category"] },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      expect(mockQb.leftJoin).not.toHaveBeenCalled();
    });

    it("should apply single relation join", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { include: ["category"] },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      expect(mockQb.leftJoin).toHaveBeenCalledTimes(1);
      expect(mockQb.leftJoin).toHaveBeenCalledWith(
        mockCategoriesTable,
        mockRelationMap.category.on,
      );
    });

    it("should apply multiple relation joins", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { include: ["category", "budget"] },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      expect(mockQb.leftJoin).toHaveBeenCalledTimes(2);
      expect(mockQb.leftJoin).toHaveBeenCalledWith(
        mockCategoriesTable,
        mockRelationMap.category.on,
      );
      expect(mockQb.leftJoin).toHaveBeenCalledWith(
        mockBudgetsTable,
        mockRelationMap.budget.on,
      );
    });

    it("should warn and skip invalid relation names", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      buildDrizzleQuery(
        mockQb,
        { include: ["invalidRelation"] },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Relation "invalidRelation" not found in relationMap. Available relations: category, budget',
      );
      expect(mockQb.leftJoin).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should apply valid relations and skip invalid ones", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      buildDrizzleQuery(
        mockQb,
        { include: ["category", "invalidRelation", "budget"] },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Relation "invalidRelation" not found in relationMap. Available relations: category, budget',
      );
      expect(mockQb.leftJoin).toHaveBeenCalledTimes(2);
      expect(mockQb.leftJoin).toHaveBeenCalledWith(
        mockCategoriesTable,
        mockRelationMap.category.on,
      );
      expect(mockQb.leftJoin).toHaveBeenCalledWith(
        mockBudgetsTable,
        mockRelationMap.budget.on,
      );

      consoleWarnSpy.mockRestore();
    });

    it("should apply joins before filters", () => {
      const mockQb = createMockQueryBuilder();
      const calls: string[] = [];

      mockQb.leftJoin = vi.fn().mockImplementation(() => {
        calls.push("leftJoin");
        return mockQb;
      });
      mockQb.where = vi.fn().mockImplementation(() => {
        calls.push("where");
        return mockQb;
      });

      const filterMap = {
        status: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
      };

      buildDrizzleQuery(
        mockQb,
        { status: "active", include: ["category"] },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      // Verify joins are applied before filters
      expect(calls).toEqual(["leftJoin", "where"]);
    });
  });

  // ============================================
  // Pagination Tests
  // ============================================

  describe("Pagination", () => {
    it("should not apply limit when not provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {};

      buildDrizzleQuery(mockQb, {}, filterMap);

      expect(mockQb.limit).not.toHaveBeenCalled();
    });

    it("should apply limit when provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { limit: 10 }, filterMap);

      expect(mockQb.limit).toHaveBeenCalledWith(10);
    });

    it("should not apply limit when limit is 0", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { limit: 0 }, filterMap);

      expect(mockQb.limit).not.toHaveBeenCalled();
    });

    it("should not apply limit when limit is negative", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { limit: -1 }, filterMap);

      expect(mockQb.limit).not.toHaveBeenCalled();
    });

    it("should not apply offset when not provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {};

      buildDrizzleQuery(mockQb, {}, filterMap);

      expect(mockQb.offset).not.toHaveBeenCalled();
    });

    it("should apply offset when provided", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { offset: 20 }, filterMap);

      expect(mockQb.offset).toHaveBeenCalledWith(20);
    });

    it("should apply offset when offset is 0", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { offset: 0 }, filterMap);

      expect(mockQb.offset).toHaveBeenCalledWith(0);
    });

    it("should not apply offset when offset is negative", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { offset: -1 }, filterMap);

      expect(mockQb.offset).not.toHaveBeenCalled();
    });

    it("should apply both limit and offset", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { limit: 10, offset: 20 }, filterMap);

      expect(mockQb.limit).toHaveBeenCalledWith(10);
      expect(mockQb.offset).toHaveBeenCalledWith(20);
    });

    it("should apply large limit and offset values", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(mockQb, { limit: 1000, offset: 5000 }, filterMap);

      expect(mockQb.limit).toHaveBeenCalledWith(1000);
      expect(mockQb.offset).toHaveBeenCalledWith(5000);
    });
  });

  // ============================================
  // Integration Tests
  // ============================================

  describe("Integration - Combined Operations", () => {
    it("should apply filters, sorting, and pagination together", () => {
      const mockQb = createMockQueryBuilder();
      const mockSql1 = { _type: "sql1" } as unknown as SQL;
      const mockSql2 = { _type: "sql2" } as unknown as SQL;
      const filterMap = {
        status: vi.fn().mockReturnValue(mockSql1),
        category: vi.fn().mockReturnValue(mockSql2),
      };

      buildDrizzleQuery(
        mockQb,
        {
          status: "active",
          category: "electronics",
          sort: "createdAt",
          order: "desc",
          limit: 25,
          offset: 50,
        },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      // Verify filters applied
      expect(mockQb.where).toHaveBeenCalled();
      expect(filterMap.status).toHaveBeenCalledWith("active");
      expect(filterMap.category).toHaveBeenCalledWith("electronics");

      // Verify sorting applied
      expect(desc).toHaveBeenCalledWith(mockColumns.createdAt);
      expect(mockQb.orderBy).toHaveBeenCalled();

      // Verify pagination applied
      expect(mockQb.limit).toHaveBeenCalledWith(25);
      expect(mockQb.offset).toHaveBeenCalledWith(50);
    });

    it("should apply includes, filters, sorting, and pagination together", () => {
      const mockQb = createMockQueryBuilder();
      const mockSql1 = { _type: "sql1" } as unknown as SQL;
      const mockSql2 = { _type: "sql2" } as unknown as SQL;
      const filterMap = {
        status: vi.fn().mockReturnValue(mockSql1),
        categoryFilter: vi.fn().mockReturnValue(mockSql2),
      };

      buildDrizzleQuery(
        mockQb,
        {
          status: "active",
          categoryFilter: "electronics",
          sort: "createdAt",
          order: "desc",
          limit: 25,
          offset: 50,
          include: ["category", "budget"],
        },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      // Verify joins applied
      expect(mockQb.leftJoin).toHaveBeenCalledTimes(2);
      expect(mockQb.leftJoin).toHaveBeenCalledWith(
        mockCategoriesTable,
        mockRelationMap.category.on,
      );
      expect(mockQb.leftJoin).toHaveBeenCalledWith(
        mockBudgetsTable,
        mockRelationMap.budget.on,
      );

      // Verify filters applied
      expect(mockQb.where).toHaveBeenCalled();
      expect(filterMap.status).toHaveBeenCalledWith("active");
      expect(filterMap.categoryFilter).toHaveBeenCalledWith("electronics");

      // Verify sorting applied
      expect(desc).toHaveBeenCalledWith(mockColumns.createdAt);
      expect(mockQb.orderBy).toHaveBeenCalled();

      // Verify pagination applied
      expect(mockQb.limit).toHaveBeenCalledWith(25);
      expect(mockQb.offset).toHaveBeenCalledWith(50);
    });

    it("should maintain correct method chaining order", () => {
      const mockQb = createMockQueryBuilder();
      const calls: string[] = [];

      mockQb.where = vi.fn().mockImplementation(() => {
        calls.push("where");
        return mockQb;
      });
      mockQb.orderBy = vi.fn().mockImplementation(() => {
        calls.push("orderBy");
        return mockQb;
      });
      mockQb.limit = vi.fn().mockImplementation(() => {
        calls.push("limit");
        return mockQb;
      });
      mockQb.offset = vi.fn().mockImplementation(() => {
        calls.push("offset");
        return mockQb;
      });

      const filterMap = {
        status: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
      };

      buildDrizzleQuery(
        mockQb,
        {
          status: "active",
          sort: "createdAt",
          order: "asc",
          limit: 10,
          offset: 5,
        },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      // Verify correct order: where -> orderBy -> limit -> offset
      expect(calls).toEqual(["where", "orderBy", "limit", "offset"]);
    });

    it("should maintain correct method chaining order with includes", () => {
      const mockQb = createMockQueryBuilder();
      const calls: string[] = [];

      mockQb.leftJoin = vi.fn().mockImplementation(() => {
        calls.push("leftJoin");
        return mockQb;
      });
      mockQb.where = vi.fn().mockImplementation(() => {
        calls.push("where");
        return mockQb;
      });
      mockQb.orderBy = vi.fn().mockImplementation(() => {
        calls.push("orderBy");
        return mockQb;
      });
      mockQb.limit = vi.fn().mockImplementation(() => {
        calls.push("limit");
        return mockQb;
      });
      mockQb.offset = vi.fn().mockImplementation(() => {
        calls.push("offset");
        return mockQb;
      });

      const filterMap = {
        status: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
      };

      buildDrizzleQuery(
        mockQb,
        {
          status: "active",
          sort: "createdAt",
          order: "asc",
          limit: 10,
          offset: 5,
          include: ["category", "budget"],
        },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
        mockRelationMap as any,
      );

      // Verify correct order: leftJoin (x2) -> where -> orderBy -> limit -> offset
      expect(calls).toEqual([
        "leftJoin",
        "leftJoin",
        "where",
        "orderBy",
        "limit",
        "offset",
      ]);
    });

    it("should handle partial query parameters", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {
        status: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
      };

      buildDrizzleQuery(
        mockQb,
        { status: "active", limit: 10 },
        filterMap,
      );

      expect(mockQb.where).toHaveBeenCalled();
      expect(mockQb.orderBy).not.toHaveBeenCalled();
      expect(mockQb.limit).toHaveBeenCalled();
      expect(mockQb.offset).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Edge Cases
  // ============================================

  describe("Edge Cases", () => {
    it("should handle empty filterMap", () => {
      const mockQb = createMockQueryBuilder();

      const result = buildDrizzleQuery(
        mockQb,
        { limit: 10 },
        {} as any,
      );

      expect(mockQb.where).not.toHaveBeenCalled();
      expect(mockQb.limit).toHaveBeenCalledWith(10);
      expect(result).toBe(mockQb);
    });

    it("should handle empty query object", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {
        status: vi.fn(),
      };

      const result = buildDrizzleQuery(mockQb, {}, filterMap);

      expect(mockQb.where).not.toHaveBeenCalled();
      expect(mockQb.orderBy).not.toHaveBeenCalled();
      expect(mockQb.limit).not.toHaveBeenCalled();
      expect(mockQb.offset).not.toHaveBeenCalled();
      expect(result).toBe(mockQb);
    });

    it("should not mutate the original query builder", () => {
      const mockQb = createMockQueryBuilder();
      const originalWhere = mockQb.where;
      const filterMap = {
        status: vi.fn().mockReturnValue({ _type: "sql" } as unknown as SQL),
      };

      buildDrizzleQuery(mockQb, { status: "active" }, filterMap);

      // Verify methods were called but object reference is maintained
      expect(mockQb.where).toBe(originalWhere);
    });

    it("should handle query with only sorting", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { sort: "name", order: "asc" },
        filterMap,
        mockColumns as unknown as Record<string, AnyColumn>,
      );

      expect(mockQb.where).not.toHaveBeenCalled();
      expect(mockQb.orderBy).toHaveBeenCalled();
      expect(mockQb.limit).not.toHaveBeenCalled();
      expect(mockQb.offset).not.toHaveBeenCalled();
    });

    it("should handle query with only pagination", () => {
      const mockQb = createMockQueryBuilder();
      const filterMap = {} as any;

      buildDrizzleQuery(
        mockQb,
        { limit: 20, offset: 10 },
        filterMap,
      );

      expect(mockQb.where).not.toHaveBeenCalled();
      expect(mockQb.orderBy).not.toHaveBeenCalled();
      expect(mockQb.limit).toHaveBeenCalledWith(20);
      expect(mockQb.offset).toHaveBeenCalledWith(10);
    });
  });
});
