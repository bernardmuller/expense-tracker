import { createError } from "@/lib/utils/createError";

export const EntityNotFoundError = createError(
  "EntityNotFoundError",
  (entity: string) => `${entity} not found`,
  {
    code: "ENTITY_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);

export const EntityCreateError = createError(
  "EntityCreateError",
  (entity: string) => `Failed to create ${entity}`,
  {
    code: "ENTITY_CREATE_ERROR",
    error: "Failed to Create",
    statusCode: 500,
  },
);

export const EntityUpdateError = createError(
  "EntityUpdateError",
  (entity: string) => `Failed to update ${entity}`,
  {
    code: "ENTITY_UPDATE_ERROR",
    error: "Failed to Update",
    statusCode: 500,
  },
);

export const EntityDeleteError = createError(
  "EntityDeleteError",
  (entity: string) => `Failed to delete ${entity}`,
  {
    code: "ENTITY_DELETE_ERROR",
    error: "Failed to Delete",
    statusCode: 500,
  },
);

export const EntityReadError = createError(
  "EntityReadError",
  (entity: string) => `Failed to read ${entity}`,
  {
    code: "ENTITY_READ_ERROR",
    error: "Failed to Read",
    statusCode: 500,
  },
);

export type RepositoryErrorType =
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EntityDeleteError>
  | InstanceType<typeof EntityReadError>;
