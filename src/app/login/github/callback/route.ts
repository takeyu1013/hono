import type { NextRequest } from "next/server";

import { cookies, headers } from "next/headers";
import { OAuthRequestError } from "@lucia-auth/oauth";

import { auth, githubAuth } from "@/lib/lucia";

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
      createUser,
    } = await githubAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({ attributes: { name: login } });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
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
