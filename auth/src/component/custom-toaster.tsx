"use client";

import { Toaster, toast } from "sonner";

export const CustomToaster = ({ message }: { message: string }) => {
	setTimeout(() =>
		toast(message, { closeButton: true, duration: Number.POSITIVE_INFINITY }),
	);
	return <Toaster />;
};
