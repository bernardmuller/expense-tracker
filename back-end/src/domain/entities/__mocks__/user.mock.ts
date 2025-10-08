import { faker } from "@faker-js/faker";
import type { User } from "../user";

export const generateMockUser = (): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  onboarded: faker.datatype.boolean(),
  emailVerified: faker.datatype.boolean(),
  name: faker.person.firstName(),
});

export const mockUsers = (count: number = 10): User[] => {
  return Array.from({ length: count }, () => generateMockUser());
};
