import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as BudgetQueries from "../queries";
import type { Budget } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { SearchQueries } from "@/lib/http/types";
import {
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

export const getBudgets = (
  search: SearchQueries<
    Budget,
    {
      userId: string;
      isActive: boolean;
    }
  >,
  ctx: AppContext,
): ResultAsync<
  Array<Budget>,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => BudgetQueries.getBudgets(search, ctx);
