import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import { createNewBudget as createNewBudgetQuery } from "../queries/createNewBudget";
import type { CreateBudgetParams } from "../types/types";
import type { Budget } from "@/lib/db/schema";
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

export const createNewBudget = (
  userId: string,
  params: CreateBudgetParams,
  ctx: AppContext,
): ResultAsync<
  Budget,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
> => createNewBudgetQuery(userId, params, ctx);
