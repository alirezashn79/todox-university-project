"use client";
import useDateStore from "@/stores/DateStore";
import client from "@/utils/client";
import { FireToast } from "@/utils/toast";
import { useState } from "react";
import { HashLoader } from "react-spinners";

export default function ToggleDoneTodo({
  id,
  isDone,
}: {
  id: string;
  isDone: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const setReload = useDateStore((state) => state.setReload);

  const handleToggleDoneTodo = async (id: string) => {
    try {
      setLoading(true);
      await client.put(`/api/todo/${id}/done`);
      setReload();
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
