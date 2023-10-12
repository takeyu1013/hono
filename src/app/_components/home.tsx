"use client";

import { useEffect, useState } from "react";

export function Home() {
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/hello");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { message } = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setMessage(message);
    };
    void fetchData();
  }, []);

  if (!message) return <p>Loading...</p>;

  return <p>{message}</p>;
}
