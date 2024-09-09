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
import { useSwipeable } from "react-swipeable";

interface ITodo {
  id: string;
  title: string;
  isDone: boolean;
  time: string;
  date: string;
}

export default function Table() {
  const date = useDateStore((state) => state.date);
  const changeDate = useDateStore((state) => state.changeDate);
  const [todosDate, setTodosDate] = useState<null | ITodo[]>(null);
  const [checkAll, setcheckAll] = useState(false);
  const allTodos = useGuest((state) => state.todos);

  const handlers = useSwipeable({
    onSwipedLeft: () => changeDate(new Date(date.setDate(date.getDate() - 1))),
    onSwipedRight: () => changeDate(new Date(date.setDate(date.getDate() + 1))),
    trackMouse: true,
  });

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
    <div className="w-full pb-20 pt-20 lg:py-10 text-gray-500 select-none">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            unoptimized
            height={200}
            width={200}
            src="/img/empty.png"
            alt="empty"
            className="pointer-events-none"
          />
          <p className="text-gray-500 text-xl text-center font-semibold mt-2">
            هنوز هیچ کاری اضافه نکردی!
          </p>
          <div className="text-gray-500 text-xs mt-1.5 flex items-center">
            برای جابجا شدن بین روزهای هفته به
            <span className="font-bold text-sm mx-1"> چپ </span>و
            <span className="font-bold text-sm ms-1"> راست </span>
            <span className="px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            بکشید
          </div>
        </div>
      </div>
    </div>
  );

  const todoEl = (
    <div className="overflow-x-auto min-h-96">
      <table className="table table-zebra rounded-t-lg overflow-hidden">
        {/* head */}
        <thead className="text-xs lg:text-sm bg-[#7480ff]/10">
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

  return (
    <section className="select-none" {...handlers}>
      {!!todosDate?.length ? todoEl : noTodoEl}
    </section>
  );
}
