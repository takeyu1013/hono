import { Container, Text } from "@mantine/core";
import { hc } from "hono/client";

import type { route } from "@/app/api/[...route]/route";
import { SignUp } from "@/component/sign-up";

export default async function Home() {
	const {
		api: {
			hello: { $get },
		},
	} = hc<typeof route>("http://localhost:3000");
	const { message } = await (await $get()).json();

	return (
		<main>
			<Container>
				<Text>{message}</Text>
				<SignUp />
			</Container>
		</main>
	);
}
