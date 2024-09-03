import UserModel from "@/models/User";
import { zSignInForm } from "@/schemas/schema";
import {
  comparePass,
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();

    const validationResult = zSignInForm.safeParse(reqBody);

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

    const user = await UserModel.findOne(
      {
        $or: [
          { email: validationResult.data.identifier },
          { phone: validationResult.data.identifier },
        ],
      },
      "password phone"
    );

    if (!user) {
      return Response.json(
        { message: "user not found" },
        {
          status: 403,
        }
      );
    }

    const verifyPass = await comparePass(
      validationResult.data.password,
      user.password
    );

    if (!verifyPass) {
      return Response.json({ message: "user not found!!" }, { status: 403 });
    }

    const cookieStore = cookies();

    const token = generateAccessToken({ phone: user.phone });
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
    });

    const refreshToken = generateRefreshToken({
      phone: user.phone,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    return Response.json(
      { message: "Welcome Back" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Server Error!",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
