"use client";

import { useSession } from "@hono/auth-js/react";
import { Text } from "@mantine/core";

export const Session = () => {
	const { data } = useSession();
	console.log(data);
	// return <Text>foo</Text>;
	return <Text>{data?.user?.email}</Text>;
};
