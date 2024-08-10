import NavigationDate from "./NavigationDate";
import Table from "./Table";

export default function List() {
  return (
    <section>
      <NavigationDate />
      <div className="mt-10">
        <Table />
      </div>
    </section>
  );
}
