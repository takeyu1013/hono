import { ErrorWithRedirect } from "@/component/error-with-redirect";
import { auth } from "@/lib/auth";
import { Text } from "@mantine/core";

export default async function Page() {
	try {
		const session = await auth();
		if (!session) {
			throw Error("Cannot get session");
		}
		return <Text>success</Text>;
	} catch (error) {
		return <ErrorWithRedirect message={`${error}`} />;
	}
}
