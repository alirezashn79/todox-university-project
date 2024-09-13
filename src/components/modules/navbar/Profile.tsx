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
            {user.avatar ? (
              <img alt="avatar" src={user.avatar} />
            ) : (
              <img alt="avatar" src="/img/user-no-avatar.png" />
            )}
          </div>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <li className="font-semibold">
          <div className="flex flex-col items-start px-2 py-3">
            <p>
              خوش اومدی <span className="text-primary">{user?.fullName}</span>
            </p>
            <span>{user.phone}</span>
          </div>
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
