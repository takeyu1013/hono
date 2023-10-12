import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const prisma = new PrismaClient();

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

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

export type AppType = typeof userRoute | typeof postRoute;

export const GET = handle(app);
