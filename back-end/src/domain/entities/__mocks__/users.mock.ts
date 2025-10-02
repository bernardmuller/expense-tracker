import { generateMockUser } from '@/mocks/domain/entities/users';
import { describe, it } from 'vitest';

describe('utils', () => {
  it('mockEntity: creates a mock user', () => {
    const markedUser = markUserAsOnboarded();
  });
});
