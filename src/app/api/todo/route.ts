import TodoModel from "@/models/Todo";
import { zTodoSchemaServer } from "@/schemas/schema";
import DbConnect from "@/utils/dbConnection";

export async function POST(req: Request) {
  try {
    const user = {
      _id: "odjfffff",
      phone: "09399963288",
    };

    if (!user) {
      return Response.json({ message: "login first" }, { status: 401 });
    }

    const reqBody = await req.json();

    const validationResult = await zTodoSchemaServer.parseAsync(reqBody);

    await DbConnect();

    const data = await TodoModel.create({
      ...validationResult,
      user: user._id,
    });

    return Response.json(
      { message: "Todo created successfully", data },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Server Error", error },
      {
        status: 500,
      }
    );
  }
}
