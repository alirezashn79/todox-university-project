"use client";

import Input from "@/components/modules/input";
import { zTodoSchemaClient } from "@/schemas/schema";
import useDateStore from "@/stores/DateStore";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import { convertToPersianTimeWithEnglishNumbers } from "@/utils/clientHelpers";
import { FireToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

  const setReload = useDateStore((state) => state.setReload);

  const [TimeValue, setTimeValue] = useState<Date | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TTodo>({
    resolver: zodResolver(zTodoSchemaClient),
  });
  const addTodoHandler: SubmitHandler<TTodo> = async (values) => {
    if (!TimeValue) {
      setTimeError("زمان الزامی است");
      return;
    }
    try {
      await client.post("/api/todo", {
        ...values,
        date: date.toISOString().split("T")[0],
        time: convertToPersianTimeWithEnglishNumbers(TimeValue as Date),
      });

      FireToast({ type: "success", message: "اضافه شد" });
      modal.current.close();
      reset();
      setReload();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(TimeValue);
  return (
    <>
      <dialog ref={modal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box !h-auto relative">
          <h3 className="font-bold text-lg">اضافه کردن کار</h3>
          <form onSubmit={handleSubmit(addTodoHandler)}>
            <div className="modal-middle space-y-4 mt-8">
              <Input
                name="title"
                register={register("title")}
                label="عنوان"
                errors={errors}
                placeholder="عنوان رو وارد کن"
              />

              <div className="form-control">
                <label className="label">
                  <span
                    className={cn("label-text", timeError ? "text-error" : "")}
                  >
                    زمان
                  </span>
                </label>
                <DatePicker
                  calendarPosition="top-left"
                  value={TimeValue}
                  onChange={(e) => setTimeValue(e?.toDate() as any)}
                  disableDayPicker
                  format="HH:mm"
                  className={cn(theme === "dark" ? "bg-dark" : "")}
                  plugins={[<TimePicker hideSeconds />]}
                  render={(_, openCalendar) => (
                    <input
                      value={TimeValue?.toLocaleTimeString("fa-ir", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      readOnly
                      onClick={() => {
                        openCalendar();
                        setTimeError(null);
                      }}
                      type="text"
                      className={cn(
                        "input input-bordered w-full",
                        timeError ? "input-error" : "input"
                      )}
                      placeholder="ساعت؟"
                    />
                  )}
                />
                {timeError && (
                  <span className="text-error mt-1">{timeError}</span>
                )}
              </div>

              <button
                className="absolute bottom-6 end-28 btn btn-primary"
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
