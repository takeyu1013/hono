import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { object, string } from "zod";

import { auth } from "@/lib/auth";

const app = new OpenAPIHono().basePath("/api");

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
	type: "http",
	scheme: "bearer",
});

export const route = app.openapi(
	createRoute({
		method: "get",
		path: "/hello",
		responses: {
			200: {
				content: {
					"application/json": { schema: object({ message: string() }) },
				},
				description: "",
			},
		},
		security: [
			{
				Bearer: [],
			},
		],
	}),
	async ({ json, req }) => {
		const { headers } = req.raw;
		// const headers = ((authorization: string) => {
		// 	const headers = new Headers();
		// 	headers.set("authorization", authorization);
		// 	return headers;
		// })(req.header("authorization") ?? "");
		const session = await auth.api.getSession({
			headers,
		});
		if (!session) {
			return json({ message: "Unauthorized" });
		}
		return json({
			message: "Hello from Hono!",
		});
	},
);

app.get("/ui", swaggerUI({ url: "/api/doc" }));
app.doc("/doc", { info: { title: "API", version: "0.1.0" }, openapi: "3.1.0" });

app.on(["POST", "GET"], "/auth/**", ({ req }) => {
	return auth.handler(req.raw);
});

export const GET = handle(app);
export const POST = handle(app);
