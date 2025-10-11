import type { User } from "@/domain/entities/user";
import type { BaseRepository } from "./baseRepository";

export interface UserRepository extends BaseRepository<User> {}
