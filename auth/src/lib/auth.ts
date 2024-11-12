import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "./prisma";

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	callbacks: {
		session({ session, token }) {
			if (session.user && token.sub) {
				console.log("session: ", session);
				const { user } = session;
				return { ...session, user: { ...user, id: token.sub } };
			}
			return session;
		},
	},
	secret: process.env.AUTH_SECRET,
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
				const { email, password } = credentials;
				const user = await prisma.user.findFirst({
					where: { email: email as string },
				});
				if (!user) {
					return null;
				}
				const isValidPassword = await compare(
					password as string,
					user.passwordDigest ?? "",
				);
				if (!isValidPassword) {
					return null;
				}
				console.log(user);
				return user;
			},
		}),
	],
} satisfies NextAuthConfig;
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
