import type { NextRequest } from "next/server";

import { cookies, headers } from "next/headers";

import { auth } from "@/lib/lucia";

export const POST = async ({ method }: NextRequest) => {
  const { validate, setSession } = auth.handleRequest(method, {
    cookies,
    headers,
  });
  const session = await validate();
  if (!session) {
    return new Response(null, { status: 401 });
  }
  await auth.invalidateSession(session.sessionId);
  setSession(null);
  return new Response(null, { status: 302, headers: { Location: "/login" } });
};
