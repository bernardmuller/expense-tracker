import { ResultAsync } from "neverthrow";
import type { UserRepository } from "../../../domain/repositories/userRepository";
import type { User as DbUser } from "@/infrastructure/db/schema";
import type { ReadParams } from "../../../domain/repositories/baseRepository";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/repositoryErrors";
import { faker } from "@faker-js/faker";

export const generateMockDbUser = (): DbUser => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  onboarded: faker.datatype.boolean(),
  emailVerified: faker.datatype.boolean(),
  name: faker.person.firstName(),
  createdAt: faker.date.anytime(),
  image: "",
  updatedAt: faker.date.anytime(),
});

export const mockDbUsers = (count: number = 10): DbUser[] => {
  return Array.from({ length: count }, () => generateMockDbUser());
};

export const mockUserStore: DbUser[] = mockDbUsers();

const create = (user: Partial<DbUser>) =>
  ResultAsync.fromPromise(
    (async () => {
      if (!user.id || !user.name || !user.email) {
        throw new Error("Missing required fields: id, name, or email");
      }
      const newUser: DbUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ?? false,
        image: user.image ?? "",
        onboarded: user.onboarded ?? false,
        createdAt: user.createdAt ?? new Date(),
        updatedAt: user.updatedAt ?? new Date(),
      };
      mockUserStore.push(newUser);
      return newUser;
    })(),
    (error) => new EntityCreateError("User", error),
  );

const read = (_params?: ReadParams<DbUser>) =>
  ResultAsync.fromPromise(
    (async () => {
      return mockUserStore;
    })(),
    (error) => new EntityReadError("User", error),
  );

const findById = (id: string) =>
  ResultAsync.fromPromise(
    (async () => {
      const user = mockUserStore.find((u) => u.id === id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return user;
    })(),
    (error) => new EntityNotFoundError("User", id),
  );

const findByEmail = (email: string) =>
  ResultAsync.fromPromise(
    (async () => {
      const user = mockUserStore.find((u) => u.email === email);
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return user;
    })(),
    (error) => new EntityReadError("User", error),
  );

const update = (user: Partial<DbUser> & { id: string }) =>
  ResultAsync.fromPromise(
    (async () => {
      return mockUserStore[0]!;
    })(),
    (error) => new EntityUpdateError("User", error),
  );

const deleteUser = (entityId: string) =>
  ResultAsync.fromPromise(
    (async () => {
      return true;
    })(),
    (error) => new EntityDeleteError("User", error),
  );

export const userRepositoryTest: UserRepository = {
  create,
  findByEmail,
  read,
  findById,
  update,
  delete: deleteUser,
};
