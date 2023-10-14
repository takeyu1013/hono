import { PrismaClient } from "@prisma/client";
import { handle } from "hono/vercel";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

// export const runtime = "edge";

const api = "/api" as const;
const app = new OpenAPIHono().basePath(api);

const openApiRoute = app.openapi(
  createRoute({
    method: "get",
    path: "/hello",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z
              .object({
                message: z.string().openapi({ example: "Hello" }),
              })
              .openapi("Hello"),
          },
        },
        description: "Retrieve the hello message",
      },
    },
  }),
  ({ jsonT }) => {
    return jsonT({
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

const route = app
  .get("/users", async (c) => {
    const users = await prisma.user.findMany();
    return c.jsonT(users);
  })
  .get("/posts", async (c) => {
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

export type AppType = typeof openApiRoute | typeof route;

export const GET = handle(app);
