import { type ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as VerificationQueries from "./queries";
import * as VerificationDomain from "./actions";
import type { CreateVerificationParams, Verification } from "./types";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";

export const createVerification = (
  params: CreateVerificationParams,
  ctx: AppContext,
): ResultAsync<
  Verification,
  InstanceType<typeof EntityCreateError> | InstanceType<typeof EntityReadError>
> =>
  VerificationDomain.createVerification(params).asyncAndThen((verification) =>
    VerificationQueries.create(verification, ctx),
  );

export const getVerificationById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  Verification,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => VerificationQueries.findById(id, ctx);
