import otpModel from "@/models/Otp";
import UserModel from "@/models/User";
import { zVerifyOtpServerSchema } from "@/schemas/schema";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import DbConnect from "@/utils/dbConnection";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    const validationResult = await zVerifyOtpServerSchema.parseAsync(reqBody);

    await DbConnect();

    const otpRecord = await otpModel.findOne({
      ...validationResult,
      isExpired: false,
    });

    if (!otpRecord) {
      return Response.json(
        { message: "invalid code" },
        {
          status: 400,
        }
      );
    }

    const now = new Date().getTime();

    if (now > otpRecord.expTime) {
      await otpModel.findByIdAndUpdate(otpRecord._id, {
        isExpired: true,
      });

      return Response.json(
        { message: "code expired" },
        {
          status: 410,
        }
      );
    }

    await otpModel.findByIdAndUpdate(otpRecord._id, {
      isExpired: true,
    });

    const token = generateAccessToken({ phone: validationResult.phone });
    const refreshToken = generateRefreshToken({
      phone: validationResult.phone,
    });

    const cookiesStore = cookies();
    cookiesStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
    });
    cookiesStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 3600 * 24,
    });

    const user = await UserModel.exists({ phone: validationResult.phone });
    console.log(user);

    if (user) {
      return Response.json(
        { message: "Welcome Back" },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        { message: "Please Complete Your Profile" },
        {
          status: 202,
        }
      );
    }
  } catch (error) {
    return Response.json(
      { message: "Server Error", error },
      {
        status: 500,
      }
    );
  }
}
