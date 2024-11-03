"use server";

import { parseWithZod } from "@conform-to/zod";

import { authClient } from "@/lib/auth-client";
import { schema } from "@/lib/zod";

export const signUp = async (prevState: unknown, formData: FormData) => {
	console.log(formData);
	const submission = parseWithZod(formData, { schema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	await authClient.signUp.email(submission.value);
};
