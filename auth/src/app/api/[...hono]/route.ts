import { auth } from "@/lib/auth";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { object, string } from "zod";

const app = new OpenAPIHono().basePath("/api");
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
	type: "http",
	scheme: "bearer",
});
const route = app.openapi(
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
	}),
	async ({ json, req }) => {
		const session = await auth();
		const email = session?.user?.email;
		if (!email) {
			return json({
				message: "Hello from Hono!",
			});
		}
		return json({
			message: `Hello from Hono, ${email}!`,
		});
	},
);

app.doc("/doc", { info: { title: "API", version: "0.1.0" }, openapi: "3.1.0" });
app.get("/ui", swaggerUI({ url: "/api/doc" }));

export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof route;
