import { isAuth } from "@/utils/serverHelpers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await isAuth();

  if (user) {
    return redirect("/");
  }
  return <div className="container">{children}</div>;
}
