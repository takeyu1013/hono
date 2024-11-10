import { Container, Text } from "@mantine/core";
import { hc } from "hono/client";
import { headers } from "next/headers";

import type { route } from "@/app/api/[...route]/route";
import { LogIn } from "@/component/log-in";
import { SignUp } from "@/component/sign-up";
import { auth } from "@/lib/auth";

export default async function Home() {
	const headersResult = await headers();
	console.log(headersResult.values());
	const result = await auth.api.getSession({ headers: headersResult });
	console.log(result);
	if (!result) {
		return (
			<main>
				<Container>
					<LogIn />
					<SignUp />
				</Container>
			</main>
		);
	}
	const { id } = result.session;
	const {
		api: {
			hello: { $get },
		},
	} = hc<typeof route>("http://localhost:3000/");
	const { message } = await (
		await $get(
			{},
			{
				headers: { Authorization: `Bearer ${id}` },
			},
		)
	).json();

	return (
		<main>
			<Container>
				<Text>{message}</Text>
				<Text>id: {id}</Text>
			</Container>
		</main>
	);
}
