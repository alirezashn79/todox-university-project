import { IUser } from "@/types";
import DropDownItem from "./DropDownItem";
import LogoutBtn from "./LogoutBtn";
import DropDown from "./DropDown";
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
        <div className="avatar online">
          <div className="w-10 rounded-full">
            <img alt="avatar" src={user?.avatar} />
          </div>
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
        <DropDownItem />
        <DropDown />
        <li>
          <LogoutBtn />
        </li>
      </ul>
    </div>
  );
}
