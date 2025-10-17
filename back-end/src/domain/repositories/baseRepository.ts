import type { Result, ResultAsync } from "neverthrow";
import type {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/repositoryErrors";

export type ReadParams<Entity> = {
  filter?: (entity: Entity, value: string) => void;
  sort?: keyof Entity;
  search?: (property: keyof Entity, value: string) => void;
};

export interface BaseRepository<Entity> {
  readonly create: (
    entity: Partial<Entity>,
  ) => ResultAsync<Entity, InstanceType<typeof EntityCreateError>>;
  readonly read: (
    params?: ReadParams<Entity>,
  ) => ResultAsync<Entity[], InstanceType<typeof EntityReadError>>;
  readonly findById: (
    id: string,
  ) => ResultAsync<
    Entity,
    | InstanceType<typeof EntityNotFoundError>
    | InstanceType<typeof EntityReadError>
  >;
  readonly update: (
    entity: Partial<Entity> & { id: string },
  ) => ResultAsync<
    Entity,
    | InstanceType<typeof EntityUpdateError>
    | InstanceType<typeof EntityNotFoundError>
  >;
  readonly delete: (
    entityId: string,
  ) => ResultAsync<boolean, InstanceType<typeof EntityDeleteError>>;
}
