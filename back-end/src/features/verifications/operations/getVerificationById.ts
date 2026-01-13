import { type ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as VerificationQueries from "../queries";
import type { Verification } from "../types";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";

export const getVerificationById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  Verification,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => VerificationQueries.findById(id, ctx);
