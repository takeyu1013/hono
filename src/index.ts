import { swaggerUI } from "@hono/swagger-ui";
import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { Lucia } from "lucia";
import { Argon2id } from "oslo/password";

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.session, client.user);
const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: ({ email }) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			email,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
}

const app = new OpenAPIHono();

const route = createRoute({
	method: "get",
	path: "/",
	responses: {
		200: {
			content: {
				"application/json": {
					schema: z.string(),
				},
			},
			description: "",
		},
	},
});
app.openapi(route, ({ json }) => {
	return json("hello");
});
app.openapi(
	createRoute({
		method: "post",
		path: "/login",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							email: z.string().email(),
							password: z.string(),
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": { schema: z.object({ token: z.string() }) },
				},
				description: "",
			},
		},
	}),
	async ({ req, json }) => {
		const { email, password } = req.valid("json");
		const user = await client.user.findUnique({ where: { email } });
		if (!user) {
			return json({ token: "" });
		}
		if (!(await new Argon2id().verify(user.hashedPassword, password))) {
			return json({ token: "" });
		}
		const { id } = await lucia.createSession(user.id, {});
		return json({ token: id });
	},
);

// The OpenAPI documentation will be available at /docs
const config = {
	openapi: "3.1.0",
	info: {
		version: "0.1.0",
		title: "API",
	},
} satisfies Parameters<OpenAPIHono["doc"]>["1"];
app.doc("/openapi.json", config);
app.getOpenAPI31Document(config);
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

export default app;
