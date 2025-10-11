import type { Result } from "neverthrow";
import type {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/domain/repositories/repositoryErrors";

export type ReadParams<Entity> = {
  filter?: (entity: Entity, value: string) => void;
  sort?: keyof Entity;
  search?: (property: keyof Entity, value: string) => void;
};

export interface BaseRepository<Entity> {
  readonly create: (entity: Entity) => Result<Entity, typeof EntityCreateError>;
  readonly read: (
    params?: ReadParams<Entity>,
  ) => Result<Entity[], typeof EntityReadError>;
  readonly findById: (
    id: string,
  ) => Result<Entity, typeof EntityNotFoundError | typeof EntityReadError>;
  readonly update: (
    entity: Entity,
  ) => Result<Entity, typeof EntityUpdateError | typeof EntityNotFoundError>;
  readonly delete: (
    entity: Entity,
  ) => Result<boolean, typeof EntityDeleteError>;
}
