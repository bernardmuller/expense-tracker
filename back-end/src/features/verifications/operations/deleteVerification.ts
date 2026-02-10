import { type ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as VerificationQueries from "../queries";
import type { Verification } from "../types";
import { EntityDeleteError } from "@/lib/errors/actionErrors";

export const deleteVerification = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  Verification,
  InstanceType<typeof EntityDeleteError>
> => VerificationQueries.remove(id, ctx);
