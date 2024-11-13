// import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { object, string } from "zod";

// import { authConfig } from "@/lib/auth";

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
	}),
	async ({ json }) => {
		return json({
			message: "Hello from Hono!",
		});
	},
);

app.doc("/doc", { info: { title: "API", version: "0.1.0" }, openapi: "3.1.0" });
app.get("/ui", swaggerUI({ url: "/api/doc" }));

// app.use(
// 	"*",
// 	initAuthConfig(() => authConfig),
// );
// app.use("/auth/*", authHandler());
// app.use("/*", verifyAuth());

export const GET = handle(app);
export const POST = handle(app);
