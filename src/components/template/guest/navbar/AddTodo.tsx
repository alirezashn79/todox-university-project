"use client";

import { zTodoSchemaClient } from "@/schemas/schema";
import useDateStore from "@/stores/DateStore";
import useGuest from "@/stores/GuestStore";
import useTheme from "@/stores/ThemeStore";
import { convertToPersianTimeWithEnglishNumbers } from "@/utils/clientHelpers";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { TypeOf } from "zod";

type TTodo = TypeOf<typeof zTodoSchemaClient>;

export default function AddTodo() {
  const modal = useRef<any>();
  const theme = useTheme((state) => state.theme);
  const date = useDateStore((state) => state.date);
  const [TimeValue, setTimeValue] = useState<Date | null>(null);
  const addTodo = useGuest((state) => state.addTodo);

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

    addTodo({
      title: values.title,
      date: date.toISOString().split("T")[0],
      time: convertToPersianTimeWithEnglishNumbers(TimeValue as Date),
    });

    toast.success("ثبت شد", {
      style: {
        backgroundColor: theme === "dark" ? "#1d232a" : undefined,
        color: theme === "dark" ? "#a6adbb" : undefined,
        border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
      },
    });
    modal.current.close();
    reset();
  };
  return (
    <>
      <dialog ref={modal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box !h-auto relative">
          <h3 className="font-bold text-lg">Add Todo</h3>
          <form onSubmit={handleSubmit(addTodoHandler)}>
            <div className="modal-middle space-y-4 mt-8">
              <div className="form-control">
                <label className="label">
                  <input
                    {...register("title")}
                    type="text"
                    className={cn(
                      "input input-bordered w-full",
                      errors.title?.message ? "input-error" : "input"
                    )}
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
                <DatePicker
                  calendarPosition="top-center"
                  value={TimeValue}
                  onChange={(e) => setTimeValue(e?.toDate() as any)}
                  disableDayPicker
                  format="HH:mm"
                  className={theme === "dark" ? "bg-dark" : ""}
                  plugins={[<TimePicker hideSeconds />]}
                  render={(_, openCalendar) => (
                    <input
                      value={TimeValue?.toLocaleTimeString("fa-ir", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      readOnly
                      onClick={openCalendar}
                      type="text"
                      className={cn("input input-bordered w-full")}
                      placeholder="Time"
                    />
                  )}
                />
              </div>

              <button
                className="absolute bottom-6 right-28 btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                اضافه کردن
              </button>
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">بستن</button>
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
