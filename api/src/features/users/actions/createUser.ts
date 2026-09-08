import { User } from "@/lib/db/schema";
import { generateUuid } from "@/lib/utils/generateUuid";
import { ok, type Result } from "neverthrow";
import { CreateUserParams } from "../types/types/CreateUserParams.type";

export const createUser = (params: CreateUserParams): Result<User, never> => {
  const uuid = generateUuid();
  const now = new Date();
  return ok({
    id: uuid,
    ...params,
    emailVerified: false,
    onboarded: false,
    image: null,
    createdAt: now,
    updatedAt: now,
  });
};
