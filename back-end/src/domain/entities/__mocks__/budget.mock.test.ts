import { describe, it, expect } from 'vitest';
import {
  generateMockBudget,
  mockBudgets,
  mockActiveBudgets,
  mockInactiveBudgets,
} from './budget.mock';

describe('generateMockBudget', () => {
  it('should generate a budget with all required properties', () => {
    const result = generateMockBudget();

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('startAmount');
    expect(result).toHaveProperty('currentAmount');
    expect(result).toHaveProperty('isActive');
  });
});

describe('mockBudgets', () => {
  it('should generate default of 10 budgets when no count is provided', () => {
    const result = mockBudgets();

    expect(result).toHaveLength(10);
  });

  it('should generate the specified number of budgets', () => {
    expect(mockBudgets(1)).toHaveLength(1);
    expect(mockBudgets(5)).toHaveLength(5);
    expect(mockBudgets(20)).toHaveLength(20);
  });

  it('should generate budgets with all required properties', () => {
    const results = mockBudgets(3);

    results.forEach((result) => {
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('startAmount');
      expect(result).toHaveProperty('currentAmount');
      expect(result).toHaveProperty('isActive');
    });
  });
});

describe('mockActiveBudgets', () => {
  it('should generate default of 10 active budgets when no count is provided', () => {
    const result = mockActiveBudgets();

    expect(result).toHaveLength(10);
  });

  it('should generate the specified number of budgets', () => {
    expect(mockActiveBudgets(2)).toHaveLength(2);
    expect(mockActiveBudgets(9)).toHaveLength(9);
    expect(mockActiveBudgets(11)).toHaveLength(11);
  });

  it('should generate active budgets with all required properties', () => {
    const results = mockActiveBudgets(3);

    results.forEach((result) => {
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('startAmount');
      expect(result).toHaveProperty('currentAmount');
      expect(result.isActive).toBe(true);
    });
  });
});

describe('mockInactiveBudgets', () => {
  it('should generate default of 10 inactive budgets when no count is provided', () => {
    const result = mockInactiveBudgets();

    expect(result).toHaveLength(10);
  });

  it('should generate the specified number of budgets', () => {
    expect(mockInactiveBudgets(2)).toHaveLength(2);
    expect(mockInactiveBudgets(8)).toHaveLength(8);
    expect(mockInactiveBudgets(13)).toHaveLength(13);
  });

  it('should generate inactive budgets with all required properties', () => {
    const results = mockInactiveBudgets(3);

    results.forEach((result) => {
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('startAmount');
      expect(result).toHaveProperty('currentAmount');
      expect(result.isActive).toBe(false);
    });
  });
});
