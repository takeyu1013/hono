"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

const Form = ({
  children,
  action,
}: {
  children: ReactNode;
  action: string;
}) => {
  const router = useRouter();
  return (
    <form
      action={action}
      method="post"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await fetch(action, {
          method: "POST",
          body: formData,
          redirect: "manual",
        });

        if (response.status === 0) {
          return router.refresh();
        }
      }}
    >
      {children}
    </form>
  );
};

export default Form;
