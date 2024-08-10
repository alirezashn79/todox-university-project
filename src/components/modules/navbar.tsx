import Link from "next/link";
import AddTodo from "../template/index/AddTodo";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 mb-8 border-b">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Todox
        </Link>
      </div>
      <AddTodo />
    </div>
  );
}
