"use client";
import useDateStore from "@/stores/DateStore";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
interface IAllCheckProps {
  checkAll: boolean;
}
export default function AllCheckTodos({ checkAll }: IAllCheckProps) {
  const date = useDateStore((state) => state.date);
  const setReload = useDateStore((state) => state.setReload);
  const [loading, setLoading] = useState(false);
  const theme = useTheme((state) => state.theme);

  const handleAllCheck = async () => {
    try {
      setLoading(true);
      await client.put("/api/todo", {
        date: date.toISOString().split("T")[0],
        isCheck: !checkAll,
      });
      MySwal.fire({
        title: "Updated!",
        text: `All todos has been ${!checkAll ? "completed" : "uncompleted"}`,
        icon: "success",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        background: theme === "dark" ? "#1d232a" : undefined,
        color: theme === "dark" ? "#a6adbb" : undefined,
      });
      setReload();
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
            checked={checkAll}
            onChange={handleAllCheck}
            type="checkbox"
            className="checkbox"
          />
        </label>
      )}
    </>
  );
}
