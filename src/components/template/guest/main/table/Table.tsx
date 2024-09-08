"use client";
import useDateStore from "@/stores/DateStore";
import useGuest from "@/stores/GuestStore";
import { convertPersianDateToEnglishNumbers } from "@/utils/clientHelpers";
import Image from "next/image";
import { useEffect, useState } from "react";
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

  const [checkAll, setcheckAll] = useState(false);
  const allTodos = useGuest((state) => state.todos);

  useEffect(() => {
    const getData = () => {
      const isoDate = convertPersianDateToEnglishNumbers(date);
      try {
        const filteredTodos = allTodos.filter((item) => item.date === isoDate);
        setTodosDate(filteredTodos);

        const result = filteredTodos.every((item: any) => item.isDone);
        setcheckAll(result);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [date, allTodos]);

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
      <table className="table table-zebra rounded-t-lg overflow-hidden">
        {/* head */}
        <thead className="text-xs lg:text-sm bg-primary/20">
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
          {todosDate?.map((item) => (
            <tr key={item.id.toString()}>
              <th>
                <ToggleDoneTodo id={item.id} isDone={item.isDone} />
              </th>
              <td className="break-all">{item.title}</td>

              <td className="text-center">{item.time || "-:-"}</td>

              <th>
                <div className="flex items-center justify-center gap-4">
                  <EditTodo id={item.id} time={item.time} title={item.title} />
                  <DeleteTodo id={item.id} />
                </div>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return <>{!!todosDate?.length ? todoEl : noTodoEl}</>;
}
