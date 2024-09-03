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
    <div className="navbar bg-base-100 mb-8 border-b">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          <span className="text-primary">X</span>
          Todo
        </Link>
      </div>
      <Theme />
      <AddTodo />
      <Profile user={user} />
    </div>
  );
}
