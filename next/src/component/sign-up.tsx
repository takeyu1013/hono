"use client";

import { signUp } from "@/lib/auth-client";
import { useState } from "react";

export const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	return (
		<div>
			<input
				type="name"
				value={name}
				onChange={(event) => setName(event.target.value)}
			/>
			<input
				type="password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
			/>
			<input
				type="email"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
			/>
			<button
				type="button"
				onClick={async () => {
					const { data, error } = await signUp.email({ email, password, name });
					console.log(data?.session.id);
				}}
			>
				Sign Up
			</button>
		</div>
	);
};
