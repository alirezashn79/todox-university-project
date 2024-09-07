import UserModel from "@/models/User";
import { zPassServer } from "@/schemas/schema";
import { comparePass, hashPass } from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { isAuthPrivate } from "@/utils/serverHelpers";

export async function PUT(req: Request) {
  try {
    const user = await isAuthPrivate();
    if (!user) {
      return Response.json(
        { message: "please login" },
        {
          status: 401,
        }
      );
    }

    const reqBody = await req.json();

    const validationResult = zPassServer.safeParse(reqBody);

    if (!validationResult.success) {
      return Response.json(
        {
          message: "invalid data",
          error: validationResult.error.formErrors.fieldErrors,
        },
        {
          status: 422,
        }
      );
    }

    await DbConnect();

    const verifyPrevPass = await comparePass(
      validationResult.data.prevPass,
      user.password
    );

    if (!verifyPrevPass) {
      return Response.json(
        { message: "prev pass is not correct" },
        {
          status: 400,
        }
      );
    }

    const hashedNewPass = await hashPass(validationResult.data.newPass);

    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedNewPass,
    });

    return Response.json({ message: "password changed" });
  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
      }
    );
  }
}
