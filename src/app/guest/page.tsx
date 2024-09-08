import Table from "@/components/template/guest/main/table/Table";
import Warning from "@/components/template/guest/main/Warning";
import Navbar from "@/components/template/guest/navbar/Navbar";
import NavigationDate from "@/components/template/index/NavigationDate";
import { isAuth } from "@/utils/serverHelpers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await isAuth();
  if (user) {
    return redirect("/");
  }

  return (
    <section className="mt-8">
      <NavigationDate />
      <div className="mt-10">
        <Table />
      </div>
    </section>
  );
}
