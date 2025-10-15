import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";
import { ZodIssueCode } from "zod";

import env from "@/env";
import { createTestApp } from "@/infrastructure/http/createApi";
import router from "./index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));

describe("health route", () => {
  it("get /health should return OK string", async () => {
    const response = await client.health.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json).toBe("OK");
    }
  });
});
