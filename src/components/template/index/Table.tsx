"use client";
import useDateStore from "@/stores/DateStore";
import client from "@/utils/client";
import { useEffect, useState } from "react";
import DeleteTodo from "./DeleteTodo";
import EditTodo from "./EditTodo";
import ToggleDoneTodo from "./ToggleDoneTodo";
import AllCheckTodos from "./AllCheckTodos";
import { ClockLoader } from "react-spinners";
import Image from "next/image";

interface ITodo {
  _id: string;
  title: string;

  isDone: boolean;
  time: string;
  date: string;
}

export default function Table() {
  const date = useDateStore((state) => state.date);
  const reload = useDateStore((state) => state.reload);
  const [todosDate, setTodosDate] = useState<null | ITodo[]>(null);
  const [loading, setLoading] = useState(true);
  const [checkAll, setcheckAll] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const isoDate = date.toISOString().split("T")[0];
      try {
        const res = await client.get(`/api/user/todos/${isoDate}`);
        const result = res.data.every((item: any) => item.isDone);

        setcheckAll(result);
        setTodosDate(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [date, reload]);

  const loadingEl = (
    <div className=" max-w-lg mx-auto py-10 mt-32 flex items-center justify-center text-primary">
      <ClockLoader color="#7480ff" />
    </div>
  );

  const noTodoEl = (
    <div className=" max-w-lg mx-auto py-10 mt-32 flex items-center justify-center">
      <Image height={200} width={200} src="/img/empty.png" alt="empty" />
    </div>
  );

  const todoEl = (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>
              <AllCheckTodos checkAll={checkAll} />
            </th>
            <th>Title</th>

            <th>Time</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {todosDate
            ?.sort(
              (a, b) =>
                (a.time.split(":")[0] as any) - (b.time.split(":")[0] as any)
            )
            .map((item) => (
              <tr key={item._id.toString()}>
                <th>
                  <ToggleDoneTodo id={item._id} isDone={item.isDone} />
                </th>
                <td>{item.title}</td>

                <td>{item.time}</td>

                <th>
                  <div className="flex items-center gap-4">
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

  return <>{loading ? loadingEl : !!todosDate?.length ? todoEl : noTodoEl}</>;
}
