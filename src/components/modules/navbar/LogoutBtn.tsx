"use client";

import client from "@/utils/client";
import { fireConfrimSwal } from "@/utils/swal";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  const { replace } = useRouter();

  const handleLogout = () => {
    const logout = async () => {
      await client.get("/api/auth/logout");
      replace("/auth/login-register");
    };
    fireConfrimSwal({
      confirmText: "آیا میخواهید خارج شوید؟",
      successFunction: logout,
      successText: "خارج شدید",
    });
  };
  return (
    <button onClick={handleLogout} className="text-error p-2">
      خارج شدن
    </button>
  );
}
