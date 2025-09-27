import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start"
import * as schema from "../db/schema.ts"
import { db } from "@/db"; // your drizzle instance

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    modelName: "users",
    additionalFields: {
      onboarded: {
        type: "boolean",
        defaultValue: false,
        required: false,
      }
    }
  },
  session: {
    modelName: "sessions"
  },
  verification: {
    modelName: "verifications"
  },
  account: {
    modelName: "accounts"
  },
  plugins: [reactStartCookies()],
  trustedOrigins: ["http://192.168.111.73:3000", "https://expense-tracker.bernardmuller.co.za"]
});
