import { generateUuid } from "@/lib/utils/generateUuid";
import type { User } from "@/features/users/types";

export const generateMockUser = (): User => {
  const uuid = generateUuid();
  return {
    id: uuid,
    name: `User ${uuid.slice(0, 8)}`,
    email: `user-${uuid.slice(0, 8)}@example.com`,
    emailVerified: false,
    onboarded: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const mockUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => generateMockUser());
};
