"use client";
import useDateStore from "@/stores/DateStore";
import client from "@/utils/client";
import { convertPersianDateToEnglishNumbers } from "@/utils/clientHelpers";
import { FireToast } from "@/utils/toast";
import { useState } from "react";
import { HashLoader } from "react-spinners";

interface IAllCheckProps {
  checkAll: boolean;
}
export default function AllCheckTodos({ checkAll }: IAllCheckProps) {
  const date = useDateStore((state) => state.date);
  const setReload = useDateStore((state) => state.setReload);
  const [loading, setLoading] = useState(false);

  const handleAllCheck = async () => {
    try {
      setLoading(true);
      await client.put("/api/todo", {
        date: convertPersianDateToEnglishNumbers(date),
        isCheck: !checkAll,
      });

      setReload();
      FireToast({
        type: "success",
        message: `همه کارها در حالت  ${
          !checkAll ? "انجام شده" : "انجام نشده"
        } قرار گرفتند`,
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
            checked={checkAll}
            onChange={handleAllCheck}
            type="checkbox"
            className="checkbox checkbox-primary"
          />
        </label>
      )}
    </>
  );
}
