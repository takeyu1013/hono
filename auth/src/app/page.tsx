import { Text } from "@mantine/core";
import { hc } from "hono/client";
import { cookies } from "next/headers";

import { Hello } from "@/component/hello";
import { SignIn } from "@/component/sign-in";
import { SignUp } from "@/component/sign-up";
import { auth } from "@/lib/auth";

import type { route } from "./api/[...route]/route";

export default async function Home() {
	const session = await auth();

	const clientCookies = await cookies();
	const cookie = clientCookies.toString();
	const {
		api: {
			hello: { $get },
		},
	} = hc<typeof route>("http://localhost:3000/");
	const { message } = await (await $get({}, { headers: { cookie } })).json();

	return (
		<main>
			<Text>session: {session?.user?.email}</Text>
			<Text>token: {clientCookies.get("authjs.session-token")?.value}</Text>
			<Text>{message}</Text>
			<SignUp />
			<SignIn />
			<Hello />
		</main>
	);
}
