import type { NextRequest } from "next/server";

import * as context from "next/headers";

import { auth } from "@/lib/lucia";

export const POST = async ({ method }: NextRequest) => {
  const { validate, setSession } = auth.handleRequest(method, context);
  const session = await validate();
  if (!session) {
    return new Response(null, { status: 401 });
  }
  await auth.invalidateSession(session.sessionId);
  setSession(null);
  return new Response(null, { status: 302, headers: { Location: "/login" } });
};
