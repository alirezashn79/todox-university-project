"use client";
import useDateStore from "@/stores/DateStore";
import { convertPersianDateToEnglishNumbers } from "@/utils/clientHelpers";
import Image from "next/image";
import { PulseLoader } from "react-spinners";
import useSWR from "swr";
import AllCheckTodos from "./AllCheckTodos";
import DeleteTodo from "./DeleteTodo";
import EditTodo from "./EditTodo";
import ToggleDoneTodo from "./ToggleDoneTodo";

interface ITodo {
  _id: string;
  title: string;

  isDone: boolean;
  time: string;
  date: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Table() {
  const date = useDateStore((state) => state.date);

  const { data, error, isLoading } = useSWR<ITodo[]>(
    date ? `/api/user/todos/${convertPersianDateToEnglishNumbers(date)}` : null,
    date ? fetcher : null
  );

  const errorEl = (
    <div className=" max-w-lg mx-auto py-10 mt-32 lg:mt-24 flex flex-col items-center justify-center">
      <p className="text-gray-500 text-xl text-center font-semibold mt-2">
        خطا در اتصال
      </p>
    </div>
  );

  const loadingEl = (
    <div className=" max-w-lg mx-auto py-10 mt-52 lg:mt-36 flex items-center justify-center text-primary">
      <PulseLoader color="#7480ff" size={18} margin={8} />
    </div>
  );

  const noTodoEl = (
    <div className=" max-w-lg mx-auto py-10 mt-32 lg:mt-24 flex flex-col items-center justify-center">
      <Image
        unoptimized
        height={200}
        width={200}
        src="/img/empty.png"
        alt="empty"
      />
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
              <AllCheckTodos
                checkAll={data?.every((item) => item.isDone) || false}
              />
            </th>
            <th>عنوان</th>

            <th className="text-center">زمان</th>
            <th className="text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="text-base lg:text-lg">
          {/* row 1 */}
          {data?.map((item) => (
            <tr key={item._id.toString()}>
              <th>
                <ToggleDoneTodo id={item._id} isDone={item.isDone} />
              </th>
              <td className="text-justify">{item.title}</td>

              <td className="text-center">{item.time || "-:-"}</td>

              <th>
                <div className="flex items-center justify-center gap-4">
                  <EditTodo
                    _id={item._id}
                    time={item.time}
                    title={item.title}
                  />
                  <DeleteTodo id={item._id} />
                </div>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isLoading) return loadingEl;
  if (!data?.length) return noTodoEl;
  if (error) return errorEl;
  return todoEl;
}
