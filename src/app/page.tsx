import dynamic from "next/dynamic";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import Form from "@/app/_components/form";
import { auth } from "@/lib/lucia";

const HelloExperimental = dynamic(
  () => import("./_components/hello-experimental"),
  { ssr: false, loading: () => <p>Loading...</p> },
);

export default async function Home() {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");
  const {
    user: { userId, name },
  } = session;

  return (
    <main>
      <h1>Home</h1>
      <HelloExperimental />
      <h2>Profile</h2>
      <p>User id: {userId}</p>
      <p>Username: {name}</p>
      <Form action="/api/logout">
        <input type="submit" value="Sign out" />
      </Form>
    </main>
  );
}
