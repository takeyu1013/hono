"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { Button, Stack, Text, TextInput } from "@mantine/core";
import type { z } from "zod";

import { logIn } from "@/lib/action";
import { authClient } from "@/lib/auth-client";
import type { logInSchema } from "@/lib/zod";
import { useActionState } from "react";

export const LogIn = () => {
	const { data } = authClient.useSession();
	const [lastResult, action] = useActionState(logIn, undefined);
	const [form, fields] = useForm({
		defaultValue: { email: "", password: "" } satisfies z.infer<
			typeof logInSchema
		>,
		lastResult,
	});
	return (
		<Stack
			renderRoot={(props) => (
				<form {...props} {...getFormProps(form)} action={action} />
			)}
		>
			<Text>data: {data?.session?.id}</Text>
			<TextInput
				{...getInputProps(fields.email, { type: "email" })}
				key={fields.email.key}
				label="Email"
			/>
			<TextInput
				{...getInputProps(fields.password, { type: "password" })}
				key={fields.password.key}
				label="Password"
			/>
			<Button type="submit">Log in</Button>
		</Stack>
	);
};
