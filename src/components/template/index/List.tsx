import TodoModel from "@/models/Todo";
import { isAuth } from "@/utils/serverHelpers";
import NavigationDate from "./NavigationDate";
import Table from "./Table";

export default async function List() {
  const user = await isAuth();
  const todos = await TodoModel.find({ user }, "-__v -user")
    .sort({ _id: -1 })
    .lean();

  return (
    <section>
      <NavigationDate />
      <div className="mt-10">
        <Table todos={JSON.parse(JSON.stringify(todos))} />
      </div>
    </section>
  );
}
