"use client";

import { Text } from "@mantine/core";
import { hc } from "hono/client";
import { useEffect, useState } from "react";

import type { route } from "@/app/api/[...route]/route";

export const Hello = () => {
	const [message, setMessage] = useState("");
	useEffect(() => {
		(async () => {
			const {
				api: {
					hello: { $get },
				},
			} = hc<typeof route>("http://localhost:3000/");
			const { message } = await (await $get()).json();
			setMessage(message);
		})();
	});

	return <Text>{message}</Text>;
};
