"use client";
import useDateStore from "@/stores/DateStore";
import client from "@/utils/client";
import { convertPersianDateToEnglishNumbers } from "@/utils/clientHelpers";
import { FireToast } from "@/utils/toast";
import { useState } from "react";
import { HashLoader } from "react-spinners";
import { mutate } from "swr";

export default function ToggleDoneTodo({
  id,
  isDone,
}: {
  id: string;
  isDone: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const date = useDateStore((state) => state.date);

  const handleToggleDoneTodo = async (id: string) => {
    try {
      setLoading(true);
      await client.put(`/api/todo/${id}/done`);
      await mutate(
        `/api/user/todos/${convertPersianDateToEnglishNumbers(date)}`
      );
      FireToast({
        type: "success",
        message: "اعمال شد",
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
        // <span className="loading loading-spinner text-primary loading-md"></span>
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
