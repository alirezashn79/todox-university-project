import { cookies } from "next/headers";
import React from "react";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <div className="container">{children}</div>;
}
