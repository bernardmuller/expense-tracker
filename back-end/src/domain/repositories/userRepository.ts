import { Context, Effect } from "effect";
import type { User } from "@/domain/entities/user";
import type { BaseRepositoryShape } from "./baseRepository";

export interface UserRepositoryShape
  extends BaseRepositoryShape<User, never, never, never, never> {}

export class UserRepository extends Context.Tag(
  "domain/repositories/userRepository",
)<UserRepository, UserRepositoryShape>() {}
