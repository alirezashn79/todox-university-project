import { IUser } from "@/types";
import Link from "next/link";
import LogoutBtn from "./LogoutBtn";
import Image from "next/image";
interface IProfileProps {
  user: IUser;
}
export default function Profile({ user }: IProfileProps) {
  return (
    <div className="dropdown dropdown-end ms-4">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img alt="avatar" src={user?.avatar} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <li className="font-semibold">
          <span className="px-2 py-3">
            خوش اومدی <span className="text-primary">{user?.fullName}</span>
          </span>
        </li>
        <li className="font-semibold">
          <Link className="px-2 py-3" href="/edit-profile">
            ویرایش پروفایل
          </Link>
        </li>
        <li>
          <LogoutBtn />
        </li>
      </ul>
    </div>
  );
}
