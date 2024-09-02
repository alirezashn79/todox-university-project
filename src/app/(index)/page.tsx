import Navbar from "@/components/modules/navbar";
import List from "@/components/template/index/List";
import { IUser } from "@/types";
import { isAuth } from "@/utils/serverHelpers";

export default async function TodoList() {
  const user = await isAuth();

  return (
    <main>
      <Navbar user={user as IUser} />
      <List />
    </main>
  );
}
