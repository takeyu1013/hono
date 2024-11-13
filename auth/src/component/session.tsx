"use client";

import { useSession } from "@hono/auth-js/react";
import { Text } from "@mantine/core";
// import { useSession } from "next-auth/react";

export const Session = () => {
	const { data } = useSession();
	console.log("session: ", data);
	return <Text>{data?.user?.email}</Text>;
};
