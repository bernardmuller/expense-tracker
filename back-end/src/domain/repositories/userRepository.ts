import type { User as DbUser } from "@/infrastructure/db/schema";
import type { BaseRepository } from "./baseRepository";
import type { ResultAsync } from "neverthrow";
import type { EntityReadError } from "@/lib/errors/repositoryErrors";

export interface UserRepository extends BaseRepository<DbUser> {
  readonly findByEmail: (
    email: string,
  ) => ResultAsync<DbUser, InstanceType<typeof EntityReadError>>;
}
