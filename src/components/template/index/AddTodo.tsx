"use client";

import Profile from "@/components/modules/navbar/Profile";
import { zDate, zTodoSchemaClient } from "@/schemas/schema";
import useDateStore from "@/stores/DateStore";
import client from "@/utils/client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { TypeOf } from "zod";

type TTodo = TypeOf<typeof zTodoSchemaClient>;

export default function AddTodo() {
  const modal = useRef<any>();
  const date = useDateStore((state) => state.date);
  const changeDate = useDateStore((state) => state.changeDate);

  const { refresh } = useRouter();

  console.log("date", date.toLocaleString("fa-ir"));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TTodo>({
    resolver: zodResolver(zTodoSchemaClient),
  });

  const addTodoHandler: SubmitHandler<TTodo> = async (values) => {
    try {
      await zDate.parseAsync({
        time: date,
      });

      const res = await client.post("/api/todo", {
        ...values,
        time: date,
      });

      toast.success(res.data.message);
      modal.current.close();
      reset();
      refresh();
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

              <div className="form-control">
                <label className="input input-bordered flex items-center gap-2">
                  <DatePicker
                    className="rmdp-mobile"
                    calendar={persian}
                    locale={persian_fa}
                    render={(_, openCalendar) => {
                      return (
                        <input
                          defaultValue={new Date(date).toLocaleDateString(
                            "fa-ir"
                          )}
                          onClick={openCalendar}
                          className="grow"
                          placeholder="Date"
                        />
                      );
                    }}
                    value={date}
                    onChange={(e) => {
                      changeDate(e?.toDate() as Date);
                    }}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="input input-bordered flex items-center gap-2">
                  <DatePicker
                    disableDayPicker
                    className="rmdp-mobile"
                    calendar={persian}
                    plugins={[<TimePicker hideSeconds />]}
                    locale={persian_fa}
                    value={date}
                    render={(_, openCalendar) => {
                      return (
                        <input
                          defaultValue={new Date(date).toLocaleTimeString(
                            "fa-ir",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                          onClick={openCalendar}
                          className="grow"
                          placeholder="Date"
                        />
                      );
                    }}
                    onChange={(e) => {
                      changeDate(e?.toDate() as Date);
                    }}
                  />
                </label>
              </div>

              <div className="form-control">
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
              </div>

              <div className="form-control">
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
              </div>

              <div className="form-control">
                <button
                  className="btn btn-primary mx-2"
                  type="submit"
                  disabled={isSubmitting}
                >
                  add todo
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
          onClick={() => modal.current.showModal()}
          className="btn btn-primary btn-sm md:btn-md"
        >
          Add Task
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
