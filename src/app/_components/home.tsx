"use client";

import { hc } from "hono/client";
import { AppType } from "@/app/api/[...route]/route";
import useSWR from "swr";

export const Home = () => {
  const { $get } = hc<AppType>("/").api.hello;

  const { data, isLoading } = useSWR(
    "api-hello",
    (() => async () => {
      const res = await $get();
      return await res.json();
    })()
  );
  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>failed to load data</p>;
  const { message } = data;

  return <p>{message}</p>;
};
