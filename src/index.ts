import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const prisma = new PrismaClient();
const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

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

serve(app);
