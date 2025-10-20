import { userSchema } from "@/domain/entities/user";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

const tags = ["Users", "List", "Create", "Patch", "Delete"];

export const getAllUsers = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(userSchema),
      "Returns a list of users",
    ),
  },
});

export const getUserById = createRoute({
  path: "/users/{id}",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchema, "Returns a user"),
  },
});

export const createUser = createRoute({
  path: "/users",
  method: "post",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchema, "Creates a user"),
  },
});

export const patchUser = createRoute({
  path: "/users/{id}",
  method: "patch",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchema, "Patches a user"),
  },
});

export const deleteUser = createRoute({
  path: "/users/{id}",
  method: "delete",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.literal("OK"), "Deletes a user"),
  },
});
