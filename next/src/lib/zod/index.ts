import { object, string } from "zod";

export const schema = object({
	email: string().email(),
	password: string(),
	name: string(),
});
