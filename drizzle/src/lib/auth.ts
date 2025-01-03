import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "sqlite" }),
	emailAndPassword: { enabled: true },
});
