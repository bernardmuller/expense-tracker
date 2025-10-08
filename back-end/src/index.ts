import { serve } from "@hono/node-server";
import { Hono } from "hono";
import {
  describeRoute,
  resolver,
  openAPIRouteHandler,
  validator,
} from "hono-openapi";
import { Schema as S } from "effect";
import { Scalar } from "@scalar/hono-api-reference";

const app = new Hono();

const querySchema = S.Struct({
  query: S.String,
});

const responseSchema = S.String;
const responseStandardSchema = S.standardSchemaV1(responseSchema);
const queryStandardSchema = S.standardSchemaV1(querySchema);

app.get(
  "/healthcheck",
  describeRoute({
    description: "return a query as a response",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "text/plain": { schema: resolver(responseStandardSchema) },
        },
      },
    },
  }),
  validator("query", queryStandardSchema),
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
