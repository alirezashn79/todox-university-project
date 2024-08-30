"use client";
import useGuest from "@/stores/GuestStore";
import useTheme from "@/stores/ThemeStore";
import { useState } from "react";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function ToggleDoneTodo({
  id,
  isDone,
}: {
  id: string;
  isDone: boolean;
}) {
  const theme = useTheme((state) => state.theme);
  const [loading, setLoading] = useState(false);
  const toggleDoneTodo = useGuest((state) => state.toggleDoneTodo);

  const handleToggleDoneTodo = async (id: string) => {
    try {
      setLoading(true);
      toggleDoneTodo(id);
      MySwal.fire({
        title: "Updated!",
        text: "اعمال شد",
        icon: "success",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        background: theme === "dark" ? "#1d232a" : undefined,
        color: theme === "dark" ? "#a6adbb" : undefined,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <HashLoader size={24} color="#7480ff" />
      ) : (
        <label>
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={isDone}
            onChange={() => handleToggleDoneTodo(id)}
          />
        </label>
      )}
    </>
  );
}
