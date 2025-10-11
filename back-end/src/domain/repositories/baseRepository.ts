import { Effect } from "effect";
import type {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/domain/errors/repositoryErrors";

export type ReadParams<Entity> = {
  filter?: (entity: Entity, value: string) => void;
  sort?: keyof Entity;
  search?: (property: keyof Entity, value: string) => void;
};

export interface BaseRepositoryShape<Entity> {
  readonly create: (entity: Entity) => Effect.Effect<Entity, EntityCreateError>;
  readonly read: (
    params?: ReadParams<Entity>,
  ) => Effect.Effect<Entity[], EntityReadError>;
  readonly findById: (
    id: string,
  ) => Effect.Effect<Entity, EntityNotFoundError | EntityReadError>;
  readonly update: (
    entity: Entity,
  ) => Effect.Effect<Entity, EntityUpdateError | EntityNotFoundError>;
  readonly delete: (
    entity: Entity,
  ) => Effect.Effect<boolean, EntityDeleteError>;
}
