import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://expense-tracker.bernardmuller.co.za'
    : 'http://localhost:3000'
})
