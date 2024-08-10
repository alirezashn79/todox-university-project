"use client";

import useDateStore from "@/stores/DateStore";
import { useRef } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/mobile.css";

export default function AddTodo() {
  const date = useDateStore((state) => state.date);
  const changeDate = useDateStore((state) => state.changeDate);

  console.log("date", date.toLocaleString("fa-ir"));

  const modal = useRef<any>();
  return (
    <>
      <dialog ref={modal} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box !h-auto">
          <h3 className="font-bold text-lg">Add Todo</h3>
          <form action="">
            <div className="modal-middle space-y-4 mt-8">
              <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Title" />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <DatePicker
                  className="rmdp-mobile"
                  calendar={persian}
                  locale={persian_fa}
                  render={(_, openCalendar) => {
                    return (
                      <input
                        value={new Date(date).toLocaleDateString("fa-ir")}
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
                        value={new Date(date).toLocaleTimeString("fa-ir", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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

              <select
                defaultValue="-1"
                className="select select-bordered w-full"
              >
                <option value="-1" disabled>
                  Priority
                </option>
                <option value="1">low</option>
                <option value="2">middle</option>
                <option value="3">high</option>
              </select>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Body"
              ></textarea>
            </div>
          </form>
          <div className="modal-action">
            <button className="btn btn-primary mx-2">add todo </button>
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

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
