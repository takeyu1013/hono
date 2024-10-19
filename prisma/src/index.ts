import { SwaggerUI, swaggerUI } from "@hono/swagger-ui";
import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { GitHub, generateState } from "arctic";
import { getCookie } from "hono/cookie";
import { Lucia, generateId } from "lucia";
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

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
	type: "http",
	scheme: "bearer",
});
app.openAPIRegistry.registerComponent("securitySchemes", "OAuth2", {
	type: "oauth2",
	flows: {
		authorizationCode: {
			authorizationUrl: "http://localhost:3000/login/github",
			tokenUrl: "http://localhost:3000/login/github/callback",
			scopes: [],
		},
	},
});

app.openapi(
	createRoute({
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
		security: [{ Bearer: [] }],
	}),
	async ({ req, json }) => {
		const authorizationHeader = req.header("authorization");
		const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
		if (!sessionId) {
			return json("");
		}
		const { session } = await lucia.validateSession(sessionId);
		if (!session) {
			return json("");
		}
		return json("hello");
	},
);
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
		if (!user || !user.hashedPassword) {
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
		request: {
			query: z.object({
				code: z.string(),
				state: z.string(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							access_token: z.string(),
							token_type: z.string(),
						}),
					},
				},
				description: "",
			},
		},
	}),
	async (context) => {
		const { code, state } = context.req.valid("query");
		const storedState = getCookie(context, "github_oauth_state");
		if (!code || !state || !storedState || state !== storedState) {
			return context.json({ access_token: "", token_type: "bearer" });
		}
		const { accessToken } = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const githubUser = z
			.object({ id: z.number(), login: z.string() })
			.parse(await githubUserResponse.json());
		const existingUser = await client.user.findUnique({
			where: { github_id: githubUser.id },
		});
		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			return context.json({ access_token: session.id, token_type: "bearer" });
		}
		const id = generateId(15);
		await client.user.create({
			data: {
				id,
				github_id: githubUser.id,
				email: githubUser.login,
			},
		});
		const session = await lucia.createSession(id, {});
		return context.json({ access_token: session.id, token_type: "bearer" });
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
