import { ResultAsync } from "neverthrow";
import type { UserRepository } from "../../../domain/repositories/userRepository";
import type { User as DbUser } from "@/infrastructure/db/schema";
import type { ReadParams } from "../../../domain/repositories/baseRepository";
import {
  EntityCreateError,
  EntityDeleteError,
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

const userStore: DbUser[] = mockDbUsers();

const create = (user: Partial<DbUser>) =>
  ResultAsync.fromPromise(
    (async () => {
      if (!user.id || !user.name || !user.email) {
        throw new Error("Missing required fields: id, name, or email");
      }
    })(),
    (error) => new EntityCreateError("User", error),
  );

const read = (_params?: ReadParams<DbUser>) =>
  ResultAsync.fromPromise(
    (async () => {})(),
    (error) => new EntityReadError("User", error),
  );

const findById = (id: string) =>
  ResultAsync.fromPromise(
    (async () => {})(),
    (error) => new EntityReadError("User", error),
  );

const update = (user: Partial<DbUser> & { id: string }) =>
  ResultAsync.fromPromise(
    (async () => {})(),
    (error) => new EntityUpdateError("User", error),
  );

const deleteUser = (entityId: string) =>
  ResultAsync.fromPromise(
    (async () => {})(),
    (error) => new EntityDeleteError("User", error),
  );

export const userRepositoryTest: UserRepository = {
  create,
  read,
  findById,
  update,
  delete: deleteUser,
};
