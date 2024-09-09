import { IUser } from "@/types";
import Link from "next/link";
import AddTodo from "../template/index/AddTodo";
import Profile from "./navbar/Profile";
import Theme from "./Theme";
interface INavbarProps {
  user: IUser;
}
export default async function Navbar({ user }: INavbarProps) {
  return (
    <div className="navbar bg-base-100 border-b sticky top-0 start-0 end-0 z-50 mb-6">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-2xl">
          <span className="text-primary animate-pulse">X</span>
          Todo
        </Link>
      </div>
      <Theme />
      <AddTodo />
      <Profile user={user} />
    </div>
  );
}
