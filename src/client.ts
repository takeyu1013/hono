import { AppType } from ".";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000/");

void (async () => {
  const response = await client.users.$get();
  if (!response.ok) return;
  const users = await response.json();
  console.log(users);
})();
