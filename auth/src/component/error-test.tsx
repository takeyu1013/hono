import { Text } from "@mantine/core";

import type { AppType } from "@/app/api/[...hono]/route";
import { auth } from "@/lib/auth";
import { hc } from "hono/client";
import { cookies } from "next/headers";
import { CustomToaster } from "./custom-toaster";

export const ErrorTest = async () => {
	try {
		const session = await auth();
		if (!session) {
			throw Error("cannot get session");
		}
		const clientCookies = await cookies();
		const cookie = clientCookies.toString();
		const {
			api: {
				hello: { $get },
			},
		} = hc<AppType>("http://localhost:3000/");
		const { message } = await (await $get({}, { headers: { cookie } })).json();

		return <Text>{message}</Text>;
	} catch (error) {
		return <CustomToaster message={`${error}`} />;
	}
};
