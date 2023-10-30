import type { NextRequest } from "next/server";

import { cookies, headers } from "next/headers";
import { OAuthRequestError } from "@lucia-auth/oauth";

import { auth, githubAuth } from "@/lib/lucia";
import { client } from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
  const storedState = cookies().get("github_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, { status: 400 });
  }
  try {
    const {
      getExistingUser,
      githubUser: { login },
    } = await githubAuth.validateCallback(code);
    const userId = await (async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser.userId;
      const { id } = await client.user.create({ data: { name: login } });
      return id;
    })();

    const session = await auth.createSession({
      userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);

    return new Response(null, { status: 302, headers: { Location: "/" } });
  } catch (error) {
    if (error instanceof OAuthRequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
};
