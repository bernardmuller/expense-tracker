import { err, ok } from "neverthrow";
import { generateUuid } from "@/lib/utils/generateUuid";

export type UserCategory = {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string;
};

export type CreateUserCategoryParams = Omit<UserCategory, "id">;

export const createUserCategory = (params: CreateUserCategoryParams) => {
  return ok({
    ...params,
    id: generateUuid(),
  });
};

export const isUserCategorySoftDeleted = (
  userCategory: UserCategory,
): boolean => false;
