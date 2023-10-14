import { PrismaClient } from "@prisma/client";
import { handle } from "hono/vercel";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

// export const runtime = "edge";

const api = "/api" as const;
const app = new OpenAPIHono().basePath(api);

const helloSchema = z
  .object({
    message: z.string().openapi({ example: "Hello" }),
  })
  .openapi("Hello");

const helloRoute = app.openapi(
  createRoute({
    method: "get",
    path: "/hello",
    responses: {
      200: {
        content: { "application/json": { schema: helloSchema } },
        description: "Retrieve the hello message",
      },
    },
  }),
  (c) => {
    return c.jsonT({
      message: "Hello from Hono!",
    });
  }
);

app.doc31("/docs", {
  openapi: "3.1.0",
  info: { title: "hono", version: "0.1.0" },
  servers: [{ url: api }],
});

const prisma = new PrismaClient();

const userRoute = app.get("/users", async (c) => {
  const users = await prisma.user.findMany();
  return c.jsonT(users);
});
const postRoute = app.get("/posts", async (c) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      authorId: true,
      title: true,
      content: true,
      published: true,
      viewCount: true,
    },
  });
  return c.jsonT(posts);
});

export type AppType = typeof helloRoute | typeof userRoute | typeof postRoute;

export const GET = handle(app);
