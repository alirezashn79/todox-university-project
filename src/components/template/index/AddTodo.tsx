"use client";

import { zTodoSchemaClient } from "@/schemas/schema";
import useDateStore from "@/stores/DateStore";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import "react-clock/dist/Clock.css";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "react-multi-date-picker/styles/layouts/mobile.css";
import TimePickerReact from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { TypeOf } from "zod";

type TTodo = TypeOf<typeof zTodoSchemaClient>;

export default function AddTodo() {
  const modal = useRef<any>();
  const theme = useTheme((state) => state.theme);
  const date = useDateStore((state) => state.date);

  const setReload = useDateStore((state) => state.setReload);

  const [TimeValue, setTimeValue] = useState<null | string>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TTodo>({
    resolver: zodResolver(zTodoSchemaClient),
  });
  const addTodoHandler: SubmitHandler<TTodo> = async (values) => {
    console.log(date.toISOString());
    try {
      const res = await client.post("/api/todo", {
        ...values,
        date: date.toISOString().split("T")[0],
        time: TimeValue,
      });

      toast.success(res.data.message, {
        style: {
          backgroundColor: theme === "dark" ? "#1d232a" : undefined,
          color: theme === "dark" ? "#a6adbb" : undefined,
          border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
        },
      });
      modal.current.close();
      reset();
      setReload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <dialog ref={modal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box !h-auto">
          <h3 className="font-bold text-lg">Add Todo</h3>
          <form onSubmit={handleSubmit(addTodoHandler)}>
            <div className="modal-middle space-y-4 mt-8">
              <div className="form-control">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    {...register("title")}
                    type="text"
                    className="grow"
                    placeholder="Title"
                  />
                </label>
                <ErrorMessage
                  errors={errors}
                  name="title"
                  render={({ message }) => (
                    <span className="text-error mt-1">{message}</span>
                  )}
                />
              </div>

              {/* <div className="form-control">
                <select
                  defaultValue="-1"
                  className="select select-bordered w-full"
                  {...register("priority")}
                >
                  <option value="-1" disabled>
                    Priority
                  </option>
                  <option value="1">low</option>
                  <option value="2">middle</option>
                  <option value="3">high</option>
                </select>
                <ErrorMessage
                  errors={errors}
                  name="priority"
                  render={({ message }) => (
                    <span className="text-error mt-1">{message}</span>
                  )}
                />
              </div> */}
              <div className="form-control">
                <TimePickerReact
                  className="input input-bordered"
                  onChange={(e) => setTimeValue(e as string)}
                  format="HH:mm"
                  value={TimeValue}
                  clockIcon={false}
                />
              </div>
              {/* <div className="form-control">
                <textarea
                  {...register("body")}
                  className="textarea textarea-bordered w-full"
                  placeholder="Body"
                ></textarea>
                <ErrorMessage
                  errors={errors}
                  name="body"
                  render={({ message }) => (
                    <span className="text-error mt-1">{message}</span>
                  )}
                />
              </div> */}

              <div className="form-control">
                <button
                  className="btn btn-primary mx-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  اضافه کردن
                </button>
              </div>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="flex-none gap-2">
        <button
          disabled={
            new Date(date.toDateString()) < new Date(new Date().toDateString())
          }
          onClick={() => modal.current.showModal()}
          className="btn btn-primary btn-sm md:btn-md"
        >
          اضافه کردن
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
