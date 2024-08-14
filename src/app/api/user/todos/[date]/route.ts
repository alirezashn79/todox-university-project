import TodoModel from "@/models/Todo";
import DbConnect from "@/utils/dbConnection";
import { isAuth } from "@/utils/serverHelpers";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      date: string;
    };
  }
) {
  try {
    const user = await isAuth();
    if (!user) {
      return Response.json(
        { message: "please login" },
        {
          status: 401,
        }
      );
    }
    await DbConnect();
    const todos = await TodoModel.find({
      user: user._id,
      date: params.date,
    });

    return Response.json(todos);
  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}
