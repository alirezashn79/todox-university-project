import Navbar from "@/components/modules/navbar";
import List from "@/components/template/index/List";
import { isAuth } from "@/utils/serverHelpers";
import { redirect } from "next/navigation";

export default async function TodoList() {
  const user = await isAuth();
  console.log(user);

  if (!user) return redirect("/auth/login-register");
  return (
    <main>
      <Navbar />
      <List />
    </main>
  );
}
