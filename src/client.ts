import { AppType } from ".";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000/");

void (async () => {
  const userResponse = await client.users.$get();
  if (!userResponse.ok) return;
  const users = await userResponse.json();
  console.table(users);

  const postResponse = await client.posts.$get();
  if (!postResponse.ok) return;
  const posts = await postResponse.json();
  console.table(posts);
})();
