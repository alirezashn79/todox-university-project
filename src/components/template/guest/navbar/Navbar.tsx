import Theme from "@/components/modules/Theme";
import Link from "next/link";
import AddTodo from "./AddTodo";
import Profile from "./Profile";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b sticky top-0 start-0 end-0 z-50">
      <div className="flex-1">
        <Link href="/guest" className="btn btn-ghost text-2xl">
          <span className="text-primary animate-pulse">X</span>
          Todo
        </Link>
      </div>
      <Theme />
      <AddTodo />
      <Profile />
    </div>
  );
}
