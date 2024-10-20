import { Text } from "@mantine/core";
import { hc } from "hono/client";

import type { route } from "@/app/api/[...route]/route";

export default async function Home() {
	const {
		api: {
			hello: { $get },
		},
	} = hc<typeof route>("http://localhost:3000");
	const { message } = await (await $get()).json();

	return (
		<main>
			<Text>{message}</Text>
		</main>
	);
}
