import { Text } from "@mantine/core";

// import { Session } from "@/component/session";
import { SignIn } from "@/component/sign-in";
import { SignUp } from "@/component/sign-up";
import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth();

	return (
		<main>
			{/* <Text>test</Text> */}
			<Text>session: {session?.user?.email}</Text>
			<SignUp />
			<SignIn />
			{/* <Session /> */}
		</main>
	);
}
