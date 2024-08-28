"use client";
import useDateStore from "@/stores/DateStore";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import { useState } from "react";
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
  const setReload = useDateStore((state) => state.setReload);

  const handleToggleDoneTodo = async (id: string) => {
    try {
      setLoading(true);
      const res = await client.put(`/api/todo/${id}/done`);
      setReload();
      MySwal.fire({
        title: "Updated!",
        text: res.data.message,
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
        <span className="loading loading-spinner text-primary loading-md"></span>
      ) : (
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={isDone}
            onChange={() => handleToggleDoneTodo(id)}
          />
        </label>
      )}
    </>
  );
}
