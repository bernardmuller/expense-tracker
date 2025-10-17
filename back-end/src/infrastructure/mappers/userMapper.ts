import { type User as DbUser } from "@/infrastructure/db/schema";
import { type User as DomainUser } from "@/domain/entities/user";
import { ok, Result } from "neverthrow";

export function mapToDomainUser(user: DbUser): DomainUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    onboarded: user.onboarded,
    emailVerified: user.emailVerified,
  };
}
