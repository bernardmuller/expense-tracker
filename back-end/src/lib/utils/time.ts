import { Effect } from "effect"

export const getCurrentISOString = Effect.sync(() => new Date().toISOString())

export const getCurrentDate = Effect.sync(() => new Date())

export const getCurrentTimestamp = Effect.sync(() => Date.now())
