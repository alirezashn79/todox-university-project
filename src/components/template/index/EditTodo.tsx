"use client";
import { zTimeSchema, zTodoSchemaClient } from "@/schemas/schema";
import useDateStore from "@/stores/DateStore";
import client from "@/utils/client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import TimePicker from "react-time-picker";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { TypeOf } from "zod";
const MySwal = withReactContent(Swal);

type TTodo = TypeOf<typeof zTodoSchemaClient>;

interface IEditTodoProps {
  _id: string;
  title: string;
  body: string;
  priority: "1" | "2" | "3";
  time: string;
}

export default function EditTodo({
  _id,
  body,
  priority,
  time,
  title,
}: IEditTodoProps) {
  const modalEdit = useRef<any>(null);
  const setReload = useDateStore((state) => state.setReload);
  const [TimeValue, setTimeValue] = useState<null | string>(time);
  const [timeError, setTimeError] = useState<null | string>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TTodo>({
    defaultValues: {
      body,
      priority,
      title,
    },
    resolver: zodResolver(zTodoSchemaClient),
  });

  const addTodoHandler: SubmitHandler<TTodo> = async (values) => {
    try {
      const timeValidation = zTimeSchema.safeParse({ time: TimeValue });

      if (!timeValidation.success) {
        setTimeError(
          timeValidation.error.formErrors.fieldErrors.time?.[0] as string
        );
        return;
      }

      const res = await client.put(`/api/todo/${_id}`, {
        ...values,
        time: timeValidation.data.time,
      });

      if (res.status === 200) {
        setReload();
      }
      modalEdit.current.close();
      MySwal.fire({
        title: "Updated!",
        text: res.data.message,
        icon: "success",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        position: "top",
      });
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
          <h3 className="font-bold text-lg">Edit Todo</h3>
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
                <TimePicker
                  className="input input-bordered"
                  onChange={(e) => setTimeValue(e)}
                  format="HH:mm"
                  value={TimeValue}
                  clockIcon={false}
                />

                {!TimeValue && timeError && (
                  <span className="text-error mt-1">{timeError}</span>
                )}
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
                  Update
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
    </>
  );
}
