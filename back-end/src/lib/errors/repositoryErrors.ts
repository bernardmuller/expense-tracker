import { createError } from "@/lib/utils/createError";

export const EntityNotFoundError = createError(
  "EntityNotFoundError",
  (entity: string) => `${entity} not found`,
);

export const EntityCreateError = createError(
  "EntityCreateError",
  (entity: string) => `Failed to create ${entity}`,
);

export const EntityUpdateError = createError(
  "EntityUpdateError",
  (entity: string) => `Failed to update ${entity}`,
);

export const EntityDeleteError = createError(
  "EntityDeleteError",
  (entity: string) => `Failed to delete ${entity}`,
);

export const EntityReadError = createError(
  "EntityReadError",
  (entity: string) => `Failed to read ${entity}`,
);

export type RepositoryErrorType =
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EntityDeleteError>
  | InstanceType<typeof EntityReadError>;
