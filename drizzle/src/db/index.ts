import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { usersTable } from "./schema";

const db = drizzle(process.env.DB_FILE_NAME || "");

(async () => {
	const users = await db.select().from(usersTable);
	console.log("Getting all users from the database: ", users);
})();
