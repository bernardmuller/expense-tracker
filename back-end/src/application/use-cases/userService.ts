import type { CreateUserParams, User } from "@/domain/entities/user";
import * as UserEntity from "@/domain/entities/user";
import type { UserRepository } from "@/domain/repositories/userRepository";
import type { UserService } from "@/domain/use-cases/userService";
import { mapToDomainUser } from "@/infrastructure/mappers/userMapper";

export const createUserService = (
  userRepository: UserRepository,
): UserService => {
  return {
    createUser: (params: CreateUserParams) =>
      // TODO: add a findByEmail here to see if the user with the email already exists
      // Add a custom find to the userRepository
      UserEntity.createUser(params).asyncAndThen((user) =>
        userRepository.create(user),
      ),

    getAllUsers: () =>
      userRepository.read().map((users) => users.map(mapToDomainUser)),

    markUserAsOnboarded: (userId: string) =>
      userRepository
        .findById(userId)
        .map(mapToDomainUser)
        .andThen(UserEntity.markUserAsOnboarded)
        .andThen((updatedUser) => userRepository.update(updatedUser))
        .map(mapToDomainUser),

    markUserAsVerified: (userId: string) =>
      userRepository
        .findById(userId)
        .map(mapToDomainUser)
        .andThen(UserEntity.markUserAsVerified)
        .andThen((updatedUser) => userRepository.update(updatedUser))
        .map(mapToDomainUser),

    updateUser: (params: User) =>
      userRepository
        .findById(params.id)
        .map(mapToDomainUser)
        .andThen((user) => UserEntity.updateUser(user, params))
        .andThen((updatedUser) => userRepository.update(updatedUser))
        .map(mapToDomainUser),

    isUserFullySetup: (userId: string) =>
      userRepository
        .findById(userId)
        .map(mapToDomainUser)
        .map((user) => UserEntity.isUserFullySetup(user)),
  };
};
