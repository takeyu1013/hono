import type { Post as PrismaPost, User } from "@prisma/client";

import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { getCookie } from "hono/cookie";
import { handle } from "hono/vercel";

import { auth } from "@/lib/lucia";
import { client } from "@/lib/prisma";

// export const runtime = "edge";

const api = "/api" as const;
const app = new OpenAPIHono().basePath(api);

type Post = Omit<PrismaPost, keyof Pick<PrismaPost, "createdAt" | "updatedAt">>;

const route = app
  .openapi(
    createRoute({
      method: "get",
      path: "/hello",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
          description: "Retrieve the hello message",
        },
      },
      security: [{ auth: [] }],
    }),
    async (context) => {
      const sessionId = getCookie(context, "auth_session");
      if (!sessionId) return context.jsonT({ message: "Hello from Hono!" });
      try {
        const {
          user: { name },
        } = await auth.validateSession(sessionId);
        return context.jsonT({
          message: `Hello ${name} from Hono!`,
        });
      } catch {
        return context.jsonT({ message: "Hello from Hono!" });
      }
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/users",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: (
                z.object({
                  id: z.string().cuid(),
                  email: z.string().nullable(),
                  name: z.string().nullable(),
                } satisfies {
                  [key in keyof User]: unknown;
                }) satisfies z.ZodType<User>
              ).array(),
            },
          },
          description: "Retrieve the users",
        },
      },
    }),
    async ({ jsonT }) => {
      const users = await client.user.findMany();
      return jsonT(users);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/posts",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: (
                z.object({
                  id: z.string().cuid(),
                  title: z.string(),
                  content: z.string().nullable(),
                  published: z.boolean(),
                  viewCount: z.number(),
                  authorId: z.string().nullable(),
                } satisfies {
                  [key in keyof Post]: unknown;
                }) satisfies z.ZodType<Post>
              ).array(),
            },
          },
          description: "Retrieve the posts",
        },
      },
    }),
    async ({ jsonT }) => {
      const posts = await client.post.findMany({
        select: {
          id: true,
          authorId: true,
          title: true,
          content: true,
          published: true,
          viewCount: true,
        },
      });
      return jsonT(posts);
    },
  );

app.openAPIRegistry.registerComponent("securitySchemes", "auth", {
  type: "apiKey",
  in: "cookie",
  name: "auth_session",
});

app.doc31("/docs", {
  openapi: "3.1.0",
  info: { title: "hono", version: "0.1.0" },
  servers: [{ url: api }],
});

export type AppType = typeof route;

export const GET = handle(app);
