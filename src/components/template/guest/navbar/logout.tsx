"use client";

import useGuest from "@/stores/GuestStore";
import useTheme from "@/stores/ThemeStore";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function LogoutBtn() {
  const { replace } = useRouter();
  const theme = useTheme((state) => state.theme);
  const clearTodos = useGuest((state) => state.clearTodos);

  const handleLogout = async () => {
    MySwal.fire({
      title: "Are you sure?",
      toast: true,
      position: "center",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Logout",
      background: theme === "dark" ? "#1d232a" : undefined,
      color: theme === "dark" ? "#a6adbb" : undefined,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          MySwal.showLoading();
          clearTodos();
          MySwal.fire({
            title: "بای",
            icon: "success",
            toast: true,
            showConfirmButton: false,
            position: "top",
            timer: 1500,
            background: theme === "dark" ? "#1d232a" : undefined,
            color: theme === "dark" ? "#a6adbb" : undefined,
          });
          replace("/auth/login-register");
        } catch (error) {
          MySwal.fire({
            title: "Error!",
            icon: "error",
            toast: true,
            background: theme === "dark" ? "#1d232a" : undefined,
            color: theme === "dark" ? "#a6adbb" : undefined,
          });
        }
      }
    });
  };
  return (
    <button onClick={handleLogout} className="text-error">
      Logout
    </button>
  );
}
