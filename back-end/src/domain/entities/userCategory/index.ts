import { Effect } from "effect";
import { MissingRequiredFieldsError } from "./userCategoryErrors";
import { generateUuid } from "@/lib/utils/generateUuid";

export type UserCategory = {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string;
};

export type CreateUserCategoryParams = Omit<UserCategory, "id">;

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
    };
  });

export const isUserCategorySoftDeleted = (
  userCategory: UserCategory,
): boolean => false;
