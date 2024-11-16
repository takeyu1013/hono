import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { object, string } from "zod";

import { prisma } from "./prisma";

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) {
					return null;
				}
				const { data, success } = await object({
					email: string().email(),
					password: string().min(6),
				}).safeParseAsync(credentials);
				if (!success) {
					return null;
				}
				const { email, password } = data;
				const user = await prisma.user.findFirst({
					where: { email },
				});
				if (!user) {
					return null;
				}
				const isValidPassword = await compare(
					password,
					user.passwordDigest ?? "",
				);
				if (!isValidPassword) {
					return null;
				}
				return user;
			},
		}),
	],
	session: { strategy: "jwt" },
} satisfies NextAuthConfig;
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);