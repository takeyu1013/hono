import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export const SignUp = () => {
	return (
		<form
			action={async (formData) => {
				"use server";
				const email = formData.get("email");
				const password = formData.get("password");
				await prisma.user.create({
					data: {
						email: `${email}`,
						passwordDigest: await hash(`${password}`, 10),
					},
				});
			}}
		>
			<label>
				Email
				<input name="email" type="email" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			<button type="submit">Sign Up</button>
		</form>
	);
};
