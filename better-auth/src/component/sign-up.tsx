"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { Button, Stack, TextInput } from "@mantine/core";
import { useActionState } from "react";

import type { z } from "zod";

import { signUp } from "@/lib/action";
import type { schema } from "@/lib/zod";

export const SignUp = () => {
	const [lastResult, action] = useActionState(signUp, undefined);
	const [form, fields] = useForm({
		defaultValue: { email: "", password: "", name: "" } satisfies z.infer<
			typeof schema
		>,
		lastResult,
	});

	return (
		<Stack
			renderRoot={(props) => (
				<form {...props} {...getFormProps(form)} action={action} />
			)}
		>
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
			<TextInput
				{...getInputProps(fields.name, { type: "text" })}
				key={fields.name.key}
				label="Name"
			/>
			<Button type="submit">Sign up</Button>
		</Stack>
	);
};
