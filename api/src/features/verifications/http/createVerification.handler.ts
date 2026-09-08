import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createVerification } from "../services";

export const createVerificationHandler = async (c: Context) => {
	const body = await c.req.json();
	const ctx = createContext();
	const result = await createVerification(body, ctx);

	return result.match(
		(verification) => c.json({ verification }, 201),
		(error) => mapErrorToResponse(error, c),
	);
};
