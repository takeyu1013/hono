import * as context from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/lucia";

const Page = async () => {
  const { validate } = auth.handleRequest("GET", context);
  const session = await validate();
  if (session) redirect("/");
  return (
    <>
      <h1>Sign in</h1>
      <a href="/login/github">Sign in with GitHub</a>
    </>
  );
};

export default Page;
