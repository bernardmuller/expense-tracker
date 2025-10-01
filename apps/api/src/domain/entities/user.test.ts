import { describe, it, expect } from 'vitest';
import { markUserAsOnboarded, markUserAsVerified } from '@/domain/entities/user';
import { mockUsers } from './__mocks__/user.mock';

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
