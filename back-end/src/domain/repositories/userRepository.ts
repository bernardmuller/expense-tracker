import type { User as DbUser } from "@/infrastructure/db/schema";
import type { BaseRepository } from "./baseRepository";

export interface UserRepository extends BaseRepository<DbUser> {}
