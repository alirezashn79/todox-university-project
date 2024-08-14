"use client";

import client from "@/utils/client";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function LogoutBtn() {
  const { replace } = useRouter();

  const handleLogout = async () => {
    try {
      const res = await client.get("/api/auth/logout");
      toast.success(res.data.message);
      replace("/auth/login-register");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button onClick={handleLogout} className="text-error">
      Logout
    </button>
  );
}
