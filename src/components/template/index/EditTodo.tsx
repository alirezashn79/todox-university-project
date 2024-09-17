"use client";
import Button from "@/components/modules/Button";
import Input from "@/components/modules/input";
import { zTodoSchemaClient } from "@/schemas/schema";
import useDateStore from "@/stores/DateStore";
import useTheme from "@/stores/ThemeStore";
import client from "@/utils/client";
import {
  convertPersianDateToEnglishNumbers,
  convertToPersianTimeWithEnglishNumbers,
  timeStringToDate,
} from "@/utils/clientHelpers";
import { FireToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn-func";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { mutate } from "swr";
import { TypeOf } from "zod";

type TTodo = TypeOf<typeof zTodoSchemaClient>;

interface IEditTodoProps {
  _id: string;
  title: string;
  time: string;
}

export default function EditTodo({ _id, time, title }: IEditTodoProps) {
  const modalEdit = useRef<any>(null);
  const theme = useTheme((state) => state.theme);
  const date = useDateStore((state) => state.date);
  const [TimeValue, setTimeValue] = useState<Date | null>(
    !!time ? timeStringToDate(time) : null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TTodo>({
    defaultValues: {
      title,
    },
    resolver: zodResolver(zTodoSchemaClient),
  });

  const addTodoHandler: SubmitHandler<TTodo> = async (values) => {
    try {
      const res = await client.put(`/api/todo/${_id}`, {
        ...values,
        time: TimeValue
          ? convertToPersianTimeWithEnglishNumbers(TimeValue)
          : "",
      });

      if (res.status === 200) {
        await mutate(
          `/api/user/todos/${convertPersianDateToEnglishNumbers(date)}`
        );
      }
      modalEdit.current.close();

      FireToast({ type: "success", message: "اعمال شد" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={() => modalEdit.current.showModal()}
        className="text-info"
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
      <dialog
        ref={modalEdit}
        className="modal modal-bottom sm:modal-middle font-normal"
      >
        <div className="modal-box !h-auto">
          <h3 className="font-bold text-lg">ویرایش</h3>
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
                  <span className={cn("label-text")}>زمان</span>
                </label>
                <div className="relative">
                  <DatePicker
                    calendarPosition="top-center"
                    value={TimeValue}
                    onChange={(e) => setTimeValue(e?.toDate() as any)}
                    disableDayPicker
                    containerClassName="w-full"
                    format="HH:mm"
                    className={cn(theme === "dark" ? "bg-dark" : "")}
                    plugins={[<TimePicker hideSeconds />]}
                    render={(value, openCalendar) => (
                      <input
                        value={value}
                        readOnly
                        onClick={() => {
                          openCalendar();
                        }}
                        type="text"
                        className={cn("input input-bordered w-full")}
                        placeholder="ساعت؟"
                      />
                    )}
                  />
                  {!!TimeValue && (
                    <div className="absolute end-4 top-0 bottom-0 flex items-center justify-center">
                      <button type="button" onClick={() => setTimeValue(null)}>
                        ❌
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Button
                loading={isSubmitting}
                disabled={
                  watch("title").trim() === title &&
                  convertToPersianTimeWithEnglishNumbers(TimeValue as Date) ===
                    time
                }
                text="ویرایش"
                className="absolute bottom-6 end-28"
              />
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  setValue("title", title);
                  setTimeValue(!!time ? timeStringToDate(time) : null);
                }}
                className="btn"
              >
                بستن
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
