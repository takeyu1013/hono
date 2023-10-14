"use client";

import { hc } from "hono/client";
import useSWR from "swr";
import { AppType } from "@/app/api/[...route]/route";

export default function HelloExperimental() {
  const { $get } = hc<AppType>("/api").hello;
  const {
    data: { message },
  } = useSWR(
    "api-hello",
    (() => async () => {
      const res = await $get();
      return await res.json();
    })(),
    { suspense: true }
  );

  return <p>{message}</p>;
}
