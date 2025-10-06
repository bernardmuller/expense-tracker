import { Effect } from "effect";
import {
  MissingRequiredFieldsError,
  UserCategoryAlreadySoftDeletedError,
} from "./userCategoryErrors";
import { generateUuid } from "@/lib/utils/generateUuid";
import { getCurrentISOString } from "@/lib/utils/time";

export type UserCategory = {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateUserCategoryParams = Omit<
  UserCategory,
  "id" | "deletedAt" | "updatedAt"
>;

export const createUserCategory = (
  params: CreateUserCategoryParams,
): Effect.Effect<UserCategory, MissingRequiredFieldsError> =>
  Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!params.userId) missingFields.push("userId");
    if (!params.categoryId) missingFields.push("categoryId");

    if (missingFields.length > 0) {
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );
    }

    const uuid = generateUuid();

    return {
      ...params,
      id: uuid,
      deletedAt: undefined,
      updatedAt: undefined,
    };
  });

export const softDeleteUserCategory = (
  userCategory: UserCategory,
): Effect.Effect<UserCategory, UserCategoryAlreadySoftDeletedError> =>
  Effect.gen(function* () {
    if (userCategory.deletedAt) {
      return yield* Effect.fail(
        new UserCategoryAlreadySoftDeletedError({
          userCategoryId: userCategory.id,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...userCategory,
      deletedAt: now,
    };
  });

export const isUserCategorySoftDeleted = (
  userCategory: UserCategory,
): boolean => !!userCategory.deletedAt;
