"use client";

import { Text } from "@mantine/core";
import useSWR from "swr";

import { redirectWithError } from "@/lib/action";

export const ErrorWithRedirect = ({ message }: { message: string }) => {
	useSWR(message, async (message) => {
		await redirectWithError(message);
	});
	return <Text>Loading...</Text>;
};
