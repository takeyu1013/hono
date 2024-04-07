import { PrismaClient } from "@prisma/client";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

const prisma = new PrismaClient();

await (async () => {
	const user = await prisma.user.create({
		data: {
			id: generateId(15),
			email: "foo@example.com",
			hashedPassword: await new Argon2id().hash("foo"),
		},
	});
	console.log(user);
})();
