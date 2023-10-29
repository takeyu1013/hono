import { cache } from "react";
import * as context from "next/headers";
// import { createClient } from "@libsql/client";
import { prisma } from "@lucia-auth/adapter-prisma";
import { github } from "@lucia-auth/oauth/providers";
// import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";

// const libsql = createClient({
//   url: process.env.TURSO_DATABASE_URL ?? "",
//   authToken: process.env.TURSO_AUTH_TOKEN ?? "",
// });
// const adapter = new PrismaLibSQL(libsql);

// export const client = new PrismaClient({ adapter });
export const client = new PrismaClient();

export const auth = lucia({
  adapter: prisma(client),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: ({ name, email }) => {
    return {
      githubUsername: name,
      githubEmail: email,
    };
  },
});

export const githubAuth = github(auth, {
  clientId: process.env.GITHUB_CLIENT_ID ?? "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});
