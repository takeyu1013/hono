"use client";

import { Button, Stack, TextInput } from "@mantine/core";

import { signUp } from "@/lib/action";

export const SignUp = () => {
	return (
		<Stack renderRoot={(props) => <form {...props} action={signUp} />}>
			<TextInput label="Email" name="email" type="email" />
			<TextInput label="Password" name="password" type="password" />
			<Button type="submit">Sign Up</Button>
		</Stack>
	);
};
