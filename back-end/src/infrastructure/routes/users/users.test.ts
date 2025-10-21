import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";

import type { User } from "@/domain/entities/user";
import env from "@/env";
import { createTestApp } from "@/infrastructure/http/createApi";
import router from "./index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));

describe("Users route", () => {
  it("get /users should return a list of users", async () => {
    const response = await client.users?.$get({
      param: {},
    });
    expect(response).toBeTruthy();
    if (response) {
      expect(response.status).toBe(200);
      if (response.status === 200) {
        const json = await response.json();
        expect(json).toBeInstanceOf(Array<User>);
      }
    }
  });
});
