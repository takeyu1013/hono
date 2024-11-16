"use client";

import { Button } from "@mantine/core";

import { logOut } from "@/lib/action";

export const SignOut = () => {
	return (
		<Button
			onClick={async () => {
				await logOut();
			}}
		>
			Sign Out
		</Button>
	);
};
