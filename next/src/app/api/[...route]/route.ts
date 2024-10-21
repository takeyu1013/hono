import { auth } from "@/lib/auth";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { object, string } from "zod";

const app = new OpenAPIHono().basePath("/api");

export const route = app
	.openapi(
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
	)
	.openapi(
		createRoute({
			method: "post",
			path: "/api/auth/sign-up/email",
			request: {
				body: {
					content: {
						"application/json": {
							schema: object({
								email: string(),
								password: string(),
								name: string(),
							}),
						},
					},
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: object({ session: object({ id: string() }) }),
						},
					},
					description: "",
				},
			},
		}),
		async ({ json, req }) => {
			const { email, password, name } = req.valid("json");
			const { session } = await auth.api.signUpEmail({
				body: { email, password, name },
			});
			const { id } = await object({ id: string() }).parseAsync(session);
			return json({ session: { id } });
		},
	);

app.get("/ui", swaggerUI({ url: "/api/doc" }));
app.doc("/doc", { info: { title: "API", version: "0.1.0" }, openapi: "3.1.0" });

export const GET = handle(app);
export const POST = handle(app);
