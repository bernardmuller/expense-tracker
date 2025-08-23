import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start"
import { db } from "@/db"; // your drizzle instance

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for development
  },
  user: {
    modelName: "users"
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
  trustedOrigins: ["http://192.168.111.73:3000"]
});
