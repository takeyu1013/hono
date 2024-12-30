import { parseWithZod } from "@conform-to/zod";

import { logInSchema, schema } from "@/lib/zod";
import { authClient } from "../auth-client";

export const signUp = async (prevState: unknown, formData: FormData) => {
	console.log(formData);
	const submission = parseWithZod(formData, { schema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	const result = await authClient.signUp.email(submission.value);
	console.log(result);
};

export const logIn = async (prevState: unknown, formData: FormData) => {
	console.log(formData);
	const submission = parseWithZod(formData, { schema: logInSchema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	const result = await authClient.signIn.email(submission.value);
	console.log(result);
};
