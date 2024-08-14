import Navbar from "@/components/modules/navbar";
import List from "@/components/template/index/List";
import { IUser } from "@/types";
import { isAuth } from "@/utils/serverHelpers";

export default async function TodoList() {
  const user = await isAuth();

  // if (!user) return redirect("/auth/login-register");
  return (
    <main>
      <Navbar user={user as IUser} />
      <List />
    </main>
  );
}
