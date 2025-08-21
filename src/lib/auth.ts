import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start"
import { db } from "@/db"; // your drizzle instance

export const auth = betterAuth({
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
  plugins: [reactStartCookies()]
});
