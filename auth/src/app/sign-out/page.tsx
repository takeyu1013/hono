"use client";

import { Text } from "@mantine/core";
import useSWR from "swr";

import { logOut } from "@/lib/action";

export default function Page() {
	useSWR("/api/auth/signout", async () => {
		await logOut();
	});
	return <Text>Loading...</Text>;
}
