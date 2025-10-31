import { generateUuid } from "@/lib/utils/generateUuid";
import type { Account } from "@/accounts/types";

export const generateMockAccount = (userId?: string): Account => {
  const uuid = generateUuid();
  return {
    id: uuid,
    userId: userId ?? generateUuid(),
    password: `hashed_password_${uuid.slice(0, 8)}`,
    accessToken: null,
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const mockAccounts = (count: number): Account[] => {
  return Array.from({ length: count }, () => generateMockAccount());
};
