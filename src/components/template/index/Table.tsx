"use client";
import Alert from "@/components/modules/Alert";
import useAlertStore from "@/stores/AlertStore";
import useDateStore from "@/stores/DateStore";
import client from "@/utils/client";
import React, { useEffect, useState } from "react";
interface ITodo {
  _id: string;
  title: string;
  body: string;
  priority: "1" | "2" | "3";
  isDone: boolean;
  time: string;
  date: string;
}

export default function Table() {
  const date = useDateStore((state) => state.date);
  const reload = useDateStore((state) => state.reload);
  const toggleAlert = useAlertStore((state) => state.toggleAlert);
  const toggleToastOpen = useAlertStore((state) => state.toggleToastOpen);
  const [todosDate, setTodosDate] = useState<null | ITodo[]>(null);
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    console.log("deleted");
    toggleAlert(false);
    toggleToastOpen();
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const isoDate = date.toISOString().split("T")[0];

      try {
        const res = await client.get(`/api/user/todos/${isoDate}`);
        setTodosDate(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [date, reload]);

  const alertEl = (
    <Alert
      type="warning"
      title="Are you sure you want to delete this task?"
      handleAccept={handleDelete}
      successText="Todo Deleted Successfully :))"
    />
  );

  const loadingEl = (
    <div className=" max-w-lg mx-auto py-10 mt-32 flex items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );

  const noTodoEl = (
    <div className=" max-w-lg mx-auto py-10 mt-32 flex items-center justify-center">
      <h1 className="text-center text-4xl font-bold">There is not todo</h1>
    </div>
  );

  const todoEl = (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Priority</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {todosDate
            ?.sort(
              (a, b) =>
                (new Date(`${a.date}T${a.time}`) as any) -
                (new Date(`${b.date}T${b.time}`) as any)
            )
            .map((item) => (
              <tr key={item._id.toString()}>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={item.isDone}
                    />
                  </label>
                </th>
                <td>{item.title}</td>
                <td>{new Date(item.date).toLocaleDateString("fa-ir")}</td>
                <td>
                  {new Date(`${item.date}T${item.time}`).toLocaleTimeString(
                    "fa-ir",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </td>
                <td>
                  <span className="text-error">{item.priority}</span>
                </td>
                <th>
                  <div className="flex items-center gap-4">
                    <button className="text-info">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleAlert(true)}
                      className="text-error"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {alertEl}

      {loading ? loadingEl : !!todosDate?.length ? todoEl : noTodoEl}
    </>
  );
}
