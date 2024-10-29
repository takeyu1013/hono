"use server";

import { schema } from "@/lib/zod";
import { parseWithZod } from "@conform-to/zod";

export const signUp = async (prevState: unknown, formData: FormData) => {
	console.log(formData);
	const { reply, status } = parseWithZod(formData, { schema });
	if (status !== "success") {
		return reply();
	}
};
