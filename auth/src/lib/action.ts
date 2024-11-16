"use server";

import { hash } from "bcrypt";

import { signIn, signOut } from "./auth";
import { prisma } from "./prisma";

export const signUp = async (formData: FormData) => {
	const email = formData.get("email");
	const password = formData.get("password");
	await prisma.user.create({
		data: {
			email: `${email}`,
			passwordDigest: await hash(`${password}`, 10),
		},
	});
};

export const logIn = async (formData: FormData) => {
	await signIn("credentials", formData);
};

export const logOut = async () => {
	await signOut();
};
