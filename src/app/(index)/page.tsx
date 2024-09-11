import NavigationDate from "@/components/template/index/NavigationDate";
import Table from "@/components/template/index/Table";

export default async function HomePage() {
  return (
    <main>
      {/* <div className="sticky top-0 left-0 right-0"> */}
      <NavigationDate />
      {/* </div> */}
      <Table />
    </main>
  );
}
