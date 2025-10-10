import { Effect } from "effect";

export type ReadParams<Entity> = {
  filter?: (entity: Entity, value: string) => void;
  sort?: keyof Entity;
  search?: (property: keyof Entity, value: string) => void;
};

export interface BaseRepositoryShape<
  Entity,
  CreateError = never,
  ReadError = never,
  UpdateError = never,
  DeleteError = never,
> {
  readonly create: (entity: Entity) => Effect.Effect<Entity, CreateError>;
  readonly read: (
    params?: ReadParams<Entity>,
  ) => Effect.Effect<Entity[], ReadError>;
  readonly findById: (id: string) => Effect.Effect<Entity, ReadError>;
  readonly update: (entity: Entity) => Effect.Effect<Entity, UpdateError>;
  readonly delete: (entity: Entity) => Effect.Effect<boolean, DeleteError>;
}
