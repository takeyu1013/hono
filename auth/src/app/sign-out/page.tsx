"use client";

import { Text } from "@mantine/core";
import useSWRImmutable from "swr/immutable";

import { logOut } from "@/lib/action";

export default function Page() {
	useSWRImmutable("sign-out", async () => {
		await logOut();
	});
	return <Text>Loading...</Text>;
}
