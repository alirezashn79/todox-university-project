import { IUser } from "@/types";
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
          <Image
            width={40}
            height={40}
            alt="Tailwind CSS Navbar component"
            src={user?.avatar}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        {/* <li>
          <a className="justify-between">Profile</a>
        </li> */}
        <li>
          <LogoutBtn />
        </li>
      </ul>
    </div>
  );
}
