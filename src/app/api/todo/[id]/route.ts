import TodoModel from "@/models/Todo";
import { zTodoEditServer } from "@/schemas/schema";
import DbConnect from "@/utils/dbConnection";
import { isAuth } from "@/utils/serverHelpers";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await isAuth();

    if (!user) {
      return Response.json(
        { message: "unauthorized" },
        {
          status: 401,
        }
      );
    }

    await DbConnect();
    const dbResult = await TodoModel.exists({ _id: params.id, user: user._id });

    if (!dbResult) {
      return Response.json({ message: "todo not found...!" }, { status: 404 });
    }

    await TodoModel.findByIdAndDelete(dbResult._id);

    return Response.json({
      message: "todo deleted successfully",
      data: dbResult,
    });
  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await isAuth();

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await DbConnect();

    const todo = await TodoModel.findOne({ _id: params.id, user: user._id });

    return Response.json(todo);
  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await isAuth();

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await DbConnect();

    const dbResult = await TodoModel.exists({ _id: params.id });

    if (!dbResult) {
      return Response.json({ message: "Todo not found" }, { status: 404 });
    }

    const reqBody = await request.json();

    const validationResult = await zTodoEditServer.parseAsync(reqBody);

    const data = await TodoModel.findByIdAndUpdate(params.id, validationResult);

    return Response.json({ message: "Todo has been updated", data });
  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}
