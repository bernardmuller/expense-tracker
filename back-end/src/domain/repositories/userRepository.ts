import type { User } from "@/infrastructure/db/schema";
import type { BaseRepository } from "./baseRepository";

export interface UserRepository extends BaseRepository<User> {}
