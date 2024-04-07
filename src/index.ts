import { swaggerUI } from "@hono/swagger-ui";
import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { GitHub, generateState } from "arctic";
import { getCookie } from "hono/cookie";
import { Lucia } from "lucia";
import { serializeCookie } from "oslo/cookie";
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
	getUserAttributes: ({ email, githubId }) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			email,
			githubId,
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
	githubId: number;
}
export const github = new GitHub(
	process.env.GITHUB_CLIENT_ID ?? "",
	process.env.GITHUB_CLIENT_SECRET ?? "",
);

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
app.openapi(
	createRoute({
		method: "get",
		path: "/login/github",
		responses: { 301: { description: "" } },
	}),
	async (context) => {
		const state = generateState();
		const url = await github.createAuthorizationURL(state);
		context.res.headers.append(
			"Set-Cookie",
			serializeCookie("github_oauth_state", state, {
				path: "/",
				secure: process.env.NODE_ENV === "production",
				httpOnly: true,
				maxAge: 60 * 10,
				sameSite: "lax",
			}),
		);
		return context.redirect(url.toString(), 301);
	},
);
app.openapi(
	createRoute({
		method: "get",
		path: "/login/github/callback",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							token: z.string(),
						}),
					},
				},
				description: "",
			},
		},
	}),
	async (context) => {
		const url = new URL(context.req.url);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");
		const storedState = getCookie(context, "github_oauth_state");
		if (!code || !state || !storedState || state !== storedState) {
			return context.json({ token: "" });
		}
		const { accessToken } = await github.validateAuthorizationCode(code);
		return context.json({ token: accessToken });
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
