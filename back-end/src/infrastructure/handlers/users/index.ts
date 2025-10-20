import type { Context } from "hono";
import type { CreateUserParams } from "@/domain/entities/user";
import { createUserService } from "@/application/use-cases/userService";
import { userRepositoryLive } from "@/infrastructure/repositories/userRepository";
import { mapErrorToHttpResponse } from "@/infrastructure/http/errorMapper";

const userService = createUserService(userRepositoryLive);

export const createUserHandler = async (c: Context) => {
  const body = await c.req.json<CreateUserParams>();
  const result = await userService.createUser(body);
  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToHttpResponse(error, c),
  );
};

export const getAllUsersHandler = async (c: Context) => {
  return await userService.getAllUsers().match(
    (users) => c.json(users, 200),
    (error) => mapErrorToHttpResponse(error, c),
  );
};

export const markUserAsOnboardedHandler = async (c: Context) => {
  const userId = c.req.param("id");
  return await userService.markUserAsOnboarded(userId).match(
    (user) => c.json(user, 200),
    (error) => mapErrorToHttpResponse(error, c),
  );
};

export const markUserAsVerifiedHandler = async (c: Context) => {
  const userId = c.req.param("id");
  return await userService.markUserAsVerified(userId).match(
    (user) => c.json(user, 200),
    (error) => mapErrorToHttpResponse(error, c),
  );
};

export const updateUserHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const body = await c.req.json();
  return await userService.updateUser(body).match(
    (user) => c.json(user, 200),
    (error) => mapErrorToHttpResponse(error, c),
  );
};

export const isUserFullySetupHandler = async (c: Context) => {
  const userId = c.req.param("id");
  return await userService.isUserFullySetup(userId).match(
    (isSetup) => c.json({ isFullySetup: isSetup }, 200),
    (error) => mapErrorToHttpResponse(error, c),
  );
};
