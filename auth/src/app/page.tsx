import { auth } from "@/lib/auth";
import { Container, Stack, Text } from "@mantine/core";
import { hc } from "hono/client";
import { cookies } from "next/headers";

import { SignIn } from "@/component/sign-in";
import { SignOut } from "@/component/sign-out";
import { SignUp } from "@/component/sign-up";

import type { AppType } from "./api/[...hono]/route";

export default async function Home() {
	const session = await auth();

	const cookieStore = await cookies();
	const cookie = cookieStore.toString();
	const {
		api: {
			hello: { $get },
		},
	} = hc<AppType>("http://localhost:3000/");
	const { message } = await (await $get({}, { headers: { cookie } })).json();

	return (
		<Container component="main">
			<Stack>
				<Text>session: {session?.user?.email}</Text>
				<Text>token: {cookieStore.get("authjs.session-token")?.value}</Text>
				<Text>{message}</Text>
				<SignUp />
				<SignIn />
				<SignOut />
			</Stack>
		</Container>
	);
}
