import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

import { prisma } from "./prisma";
import { signInSchema } from "./zod";

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const { email, password } =
						await signInSchema.parseAsync(credentials);
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
				} catch (error) {
					if (error instanceof ZodError) {
						return null;
					}
					throw error;
				}
			},
		}),
	],
	session: { strategy: "jwt" },
	trustHost: true,
} satisfies NextAuthConfig;
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
