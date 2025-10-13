import { serve } from "@hono/node-server";
import { Hono } from "hono";
import {
  describeRoute,
  resolver,
  openAPIRouteHandler,
  validator,
} from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { mapErrorToHttpResponse } from "@/infrastructure/http/errorMapper";
import { z } from "zod";

const app = new Hono();

const querySchema = z.object({
  query: z.string(),
});

const responseSchema = z.string();

// User schemas
const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
});

const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  onboarded: z.boolean(),
});

const usersResponseSchema = z.array(userResponseSchema);

app.get(
  "/healthcheck",
  describeRoute({
    description: "return a query as a response",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "text/plain": { schema: resolver(responseSchema) },
        },
      },
    },
  }),
  validator("query", querySchema),
  (c) => {
    const query = c.req.valid("query");
    return c.json(`Your query: ${query.query}`);
  },
);

app.get(
  "/docs",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Hono API",
        version: "1.0.0",
        description: "Greeting API",
      },
      servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    },
  }),
);

app.get("/scalar", Scalar({ url: "/docs" }));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
