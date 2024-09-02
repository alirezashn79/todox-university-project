import Table from "@/components/template/guest/main/table/Table";
import Navbar from "@/components/template/guest/navbar/Navbar";
import NavigationDate from "@/components/template/index/NavigationDate";
import { isAuth } from "@/utils/serverHelpers";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await isAuth();
  if (user) {
    return redirect("/");
  }

  return (
    <div className="container">
      <main>
        <Navbar />
        <section>
          <NavigationDate />
          <div className="mt-10">
            <Table />
          </div>
        </section>
      </main>
    </div>
  );
}
