import { cookies, headers } from "next/headers";

import { auth } from "@/lib/lucia";
import Form from "../_components/form";

const Page = async () => {
  const { validate } = auth.handleRequest("GET", { cookies, headers });
  const session = await validate();

  return (
    <>
      {session ? (
        (() => {
          const {
            user: { userId, name },
          } = session;

          return (
            <>
              <h2>Profile</h2>
              <p>User id: {userId}</p>
              <p>Username: {name}</p>
              <Form action="/api/logout">
                <input type="submit" value="Sign out" />
              </Form>
            </>
          );
        })()
      ) : (
        <>
          <h1>Sign in</h1>
          <a href="/login/github">Sign in with GitHub</a>
        </>
      )}
    </>
  );
};

export default Page;
