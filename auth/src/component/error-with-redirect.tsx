"use client";

import { Text } from "@mantine/core";
import useSWRImmutable from "swr/immutable";

import { redirectWithError } from "@/lib/action";

export const ErrorWithRedirect = ({ message }: { message: string }) => {
	useSWRImmutable(message, async (message) => {
		await redirectWithError(message);
	});
	return <Text>Loading...</Text>;
};
