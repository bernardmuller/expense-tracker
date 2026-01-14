import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import * as UserDomain from "../actions";
import type { OnboardingParams, User, UserAlreadyOnboardedError } from "../types";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import {
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
} from "@/lib/utils/encryption";
import { getUserById } from "./getUserById";

export const onboardUser = (
  userId: string,
  params: OnboardingParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsOnboarded(user).asyncAndThen(() =>
      UserQueries.onboardUser(userId, params, ctx),
    ),
  );
