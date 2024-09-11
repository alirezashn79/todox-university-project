import Link from "next/link";
import DropDownItem from "./DropDownItem";
import DropDown from "@/components/modules/navbar/DropDown";

export default function Profile() {
  return (
    <>
      <div className="dropdown dropdown-end ms-4">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li className="font-semibold">
            <p className="px-2 py-3">
              خوش اومدی <span className="text-primary">کاربر مهمان</span>
            </p>
          </li>
          <DropDownItem />
          <li>
            <Link
              className="px-2 py-3 font-semibold"
              href="/auth/login-register"
            >
              ثبت نام
            </Link>
          </li>
          <DropDown />
        </ul>
      </div>
    </>
  );
}
