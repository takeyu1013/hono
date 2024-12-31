import { drizzle } from "drizzle-orm/libsql";

import { users } from "./schema";

const db = drizzle(process.env.DB_FILE_NAME || "");

(async () => {
	const user: typeof users.$inferInsert = {
		name: "John",
		email: "john@example.com",
	};

	await db.insert(users).values(user);
	console.log("New user created!");
})();
