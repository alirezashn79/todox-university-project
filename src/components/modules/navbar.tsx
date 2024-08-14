import Link from "next/link";
import AddTodo from "../template/index/AddTodo";
import Profile from "./navbar/Profile";
import { IUser } from "@/types";
interface INavbarProps {
  user: IUser;
}
export default async function Navbar({ user }: INavbarProps) {
  // const payload = verifyAccessToken(cookies().get("token")?.value as string);
  // const user = await UserModel.findOne({ phone: payload?.phone });
  // console.log(user);
  return (
    <div className="navbar bg-base-100 mb-8 border-b">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Todox
        </Link>
      </div>
      <AddTodo />
      <Profile user={user} />
    </div>
  );
}
