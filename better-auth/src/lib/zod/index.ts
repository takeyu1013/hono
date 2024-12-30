import { object, string } from "zod";

export const schema = object({
	email: string().email(),
	password: string(),
	name: string(),
});

export const logInSchema = object({
	email: string().email(),
	password: string(),
});
