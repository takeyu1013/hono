import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

import { usersTable } from "./schema";

const db = drizzle(process.env.DB_FILE_NAME || "");

(async () => {
	const user: typeof usersTable.$inferInsert = {
		name: "John",
		age: 30,
		email: "john@example.com",
	};

	await db.insert(usersTable).values(user);
	console.log("New user created!");
})();
