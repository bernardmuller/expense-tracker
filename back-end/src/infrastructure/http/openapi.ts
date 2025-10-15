import { Scalar } from "@scalar/hono-api-reference";
import type { AppOpenAPI } from "../http/types";
import packageJSON from "../../../package.json" with { type: "json" };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Budget API",
    },
  });

  app.get(
    "/scalar",
    Scalar({
      url: "/doc",
      theme: "mars",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  );
}
