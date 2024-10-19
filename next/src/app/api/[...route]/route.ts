import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { object, string } from "zod";

export const runtime = "edge";

const app = new OpenAPIHono().basePath("/api");

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
	({ json }) => {
		return json({
			message: "Hello from Hono!",
		});
	},
);

app.get("/ui", swaggerUI({ url: "/api/doc" }));
app.doc("/doc", { info: { title: "API", version: "0.1.0" }, openapi: "3.1.0" });

export const GET = handle(app);
