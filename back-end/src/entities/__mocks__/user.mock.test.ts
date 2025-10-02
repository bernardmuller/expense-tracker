import { describe, it, expect } from 'vitest';
import { generateMockUser, mockUsers } from './user.mock.js';

describe('generateMockUser', () => {
  it('should generate a user with all required properties', () => {
    const user = generateMockUser();

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('onboarded');
    expect(user).toHaveProperty('emailVerified');
    expect(user).toHaveProperty('name');
  });
});

describe('mockUsers', () => {
  it('should generate default of 10 users when no count is provided', () => {
    const users = mockUsers();

    expect(users).toHaveLength(10);
  });

  it('should generate the specified number of users', () => {
    expect(mockUsers(1)).toHaveLength(1);
    expect(mockUsers(5)).toHaveLength(5);
    expect(mockUsers(20)).toHaveLength(20);
  });

  it('should generate users with all required properties', () => {
    const users = mockUsers(3);

    users.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('onboarded');
      expect(user).toHaveProperty('emailVerified');
      expect(user).toHaveProperty('name');
    });
  });
});
