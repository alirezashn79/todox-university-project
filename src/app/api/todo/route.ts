import TodoModel from "@/models/Todo";
import { zTodoSchemaServer } from "@/schemas/schema";
import DbConnect from "@/utils/dbConnection";
import { isAuth } from "@/utils/serverHelpers";

export async function POST(req: Request) {
  try {
    const user = await isAuth();

    if (!user) {
      return Response.json({ message: "please login" }, { status: 401 });
    }

    const reqBody = await req.json();

    const validationResult = await zTodoSchemaServer.parseAsync(reqBody);

    await DbConnect();

    const data = await TodoModel.create({
      ...validationResult,
      user,
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

export async function GET() {
  try {
    const user = await isAuth();

    if (!user) {
      return Response.json(
        { message: "you are not login" },
        {
          status: 401,
        }
      );
    }
    await DbConnect();
    const todos = await TodoModel.find({ user });

    return Response.json(todos);
  } catch (error) {
    return Response.json(
      { message: "Server Error" },
      {
        status: 500,
      }
    );
  }
}
