"use client";
import useDateStore from "@/stores/DateStore";
import useGuest from "@/stores/GuestStore";
import { convertPersianDateToEnglishNumbers } from "@/utils/clientHelpers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import AllCheckTodos from "./AllCheckTodos";
import DeleteTodo from "./DeleteTodo";
import EditTodo from "./EditTodo";
import ToggleDoneTodo from "./ToggleDoneTodo";

interface ITodo {
  id: string;
  title: string;
  isDone: boolean;
  time: string;
  date: string;
}

export default function Table() {
  const date = useDateStore((state) => state.date);
  const [todosDate, setTodosDate] = useState<null | ITodo[]>(null);
  const [loading, setLoading] = useState(true);
  const [checkAll, setcheckAll] = useState(false);
  const allTodos = useGuest((state) => state.todos);

  useEffect(() => {
    const getData = () => {
      setLoading(true);
      const isoDate = convertPersianDateToEnglishNumbers(date);
      try {
        const filteredTodos = allTodos.filter((item) => item.date === isoDate);
        setTodosDate(filteredTodos);

        const result = filteredTodos.every((item: any) => item.isDone);
        setcheckAll(result);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    getData();
  }, [date, allTodos]);

  const loadingEl = (
    <div className=" max-w-lg mx-auto py-10 mt-52 lg:mt-36 flex items-center justify-center text-primary">
      <PulseLoader color="#7480ff" size={18} margin={8} />
    </div>
  );

  const noTodoEl = (
    <div className=" max-w-lg mx-auto py-10 mt-32 lg:mt-8 flex flex-col items-center justify-center">
      <Image height={200} width={200} src="/img/empty.png" alt="empty" />
      <p className="text-gray-500 text-xl text-center font-semibold mt-2">
        هنوز هیچ کاری اضافه نکردی!
      </p>
    </div>
  );

  const todoEl = (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead className="text-xs lg:text-sm">
          <tr>
            <th>
              <AllCheckTodos checkAll={checkAll} />
            </th>
            <th>عنوان</th>

            <th className="text-center">زمان</th>
            <th className="text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="text-base lg:text-lg">
          {/* row 1 */}
          {todosDate
            ?.sort(
              (a, b) =>
                (a.time.split(":")[0] as any) - (b.time.split(":")[0] as any)
            )
            .map((item) => (
              <tr key={item.id.toString()}>
                <th className="ps-5">
                  <ToggleDoneTodo id={item.id} isDone={item.isDone} />
                </th>
                <td className="lg:min-w-64">{item.title}</td>

                <td className="text-center">{item.time || "-:-"}</td>

                <th>
                  <div className="flex items-center justify-center gap-4">
                    <EditTodo
                      id={item.id}
                      time={item.time}
                      title={item.title}
                    />
                    <DeleteTodo id={item.id} />
                  </div>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return <>{loading ? loadingEl : !!todosDate?.length ? todoEl : noTodoEl}</>;
}
