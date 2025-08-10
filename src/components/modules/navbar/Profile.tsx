import { IUser } from '@/types'
import DropDownItem from './DropDownItem'
import LogoutBtn from './LogoutBtn'
import DropDown from './DropDown'
interface IProfileProps {
  user: IUser
}
export default function Profile({ user }: IProfileProps) {
  return (
    <div className="dropdown dropdown-end ms-4">
      <div tabIndex={1} role="button" className="avatar btn btn-circle btn-ghost">
        <div className="avatar online">
          <div className="w-10 rounded-full">
            {user?.avatar ? (
              <img alt="avatar" src={user.avatar} />
            ) : (
              <img alt="avatar" src="/img/user-no-avatar.png" />
            )}
          </div>
        </div>
      </div>
      <ul
        tabIndex={1}
        className="menu dropdown-content menu-sm mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        <li className="font-semibold">
          <div className="flex flex-col items-start px-2 py-3">
            <p>
              خوش اومدی <span className="mx-1 text-primary">{user?.fullName}</span>
            </p>
            {user.phone && <span className="text-primary">{user.phone}</span>}
            {user.email && <span className="text-wrap text-xs text-primary">{user.email}</span>}
          </div>
        </li>
        <DropDownItem />
        <DropDown />
        <li>
          <LogoutBtn />
        </li>
      </ul>
    </div>
  )
}
