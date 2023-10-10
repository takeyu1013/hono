import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const prisma = new PrismaClient();
const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

const route = app.get("/users", async (c) => {
  const users = await prisma.user.findMany();
  return c.jsonT(users);
});

export type AppType = typeof route;

serve(app);
