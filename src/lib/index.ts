import { createClient } from "@libsql/client";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { lucia } from "lucia";

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});
const adapter = new PrismaLibSQL(libsql);

export const client = new PrismaClient({ adapter });

export const auth = lucia({
  env: "DEV", // "PROD" if deployed to HTTPS
  adapter: prisma(client),
});
