"use client";

import Table from "@/components/template/guest/main/table/Table";
import Navbar from "@/components/template/guest/navbar/Navbar";
import NavigationDate from "@/components/template/index/NavigationDate";

export default function page() {
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
