import { describe, it, expect, beforeEach } from 'vitest';
import { markUserAsOnboarded, markUserAsVerified, updateUserProfile, type User } from '@/domain/entities/user';
import { mockUsers, generateMockUser } from './__mocks__/user.mock';

describe('markUserAsOnboarded', () => {
  it('should mark the user as onboarded', () => {
    const users = mockUsers(5);

    for (const user of users) {
      const markedUser = markUserAsOnboarded(user);
      expect(markedUser.onboarded).toEqual(true);
    }
  });
});

describe('markUserAsVerified', () => {
  it('should mark the user as verified', () => {
    const users = mockUsers(5);

    for (const user of users) {
      const markedUser = markUserAsVerified(user);
      expect(markedUser.emailVerified).toEqual(true);
    }
  });
});

describe('updateUserProfile', () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      id: '47d2aada-ac9d-4353-a95a-8dcea2aeb96f',
      name: "John Doe",
      email: "john@email.com",
      emailVerified: false,
      onboarded: true
    };
  });

  it('should update user name', () => {
    const params = {
      ...mockUser,
      name: "Jane Doe"
    };

    const markedUser = updateUserProfile(mockUser, params);
    expect(markedUser.name).toEqual(params.name);
  });

  it('should not update user email', () => {
    const params = {
      ...mockUser,
      email: "shouldnotwork@email.com"
    };

    const result = updateUserProfile(mockUser, params);
    expect(result.email).toEqual(mockUser.email);
  });

  it('should not update any properties other than user name', () => {
    const params = generateMockUser();
    const result = updateUserProfile(mockUser, params);

    expect(result.email).toEqual(mockUser.email);
    expect(result.name).toEqual(params.name);
    expect(result.emailVerified).toEqual(mockUser.emailVerified);
    expect(result.onboarded).toEqual(mockUser.onboarded);
    expect(result.id).toEqual(mockUser.id);
  });
});
