"use client";

import { SessionProvider } from "@hono/auth-js/react";
import type { PropsWithChildren } from "react";

export const Provider = ({ children }: PropsWithChildren) => {
	return <SessionProvider>{children}</SessionProvider>;
};
