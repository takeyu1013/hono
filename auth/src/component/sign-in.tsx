"use client";

import { logIn } from "@/lib/action";
import { Button, Stack, TextInput } from "@mantine/core";

export const SignIn = () => {
	return (
		<Stack renderRoot={(props) => <form {...props} action={logIn} />}>
			<TextInput label="Email" name="email" type="email" />
			<TextInput label="Password" name="password" type="password" />
			<Button type="submit">Sign In</Button>
		</Stack>
	);
};
