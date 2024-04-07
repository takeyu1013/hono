import { swaggerUI } from "@hono/swagger-ui";
import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { Lucia } from "lucia";

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

// The OpenAPI documentation will be available at /docs
const config = {
	openapi: "3.1.0",
	info: {
		version: "1.0.0",
		title: "API",
	},
} satisfies Parameters<OpenAPIHono["doc"]>["1"];
app.doc("/openapi.json", config);
app.getOpenAPI31Document(config);
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

export default app;
